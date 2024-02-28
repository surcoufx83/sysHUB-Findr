import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { RestService, SyshubConfigItem, SyshubJobType, SyshubPSetItem, SyshubWorkflow, SyshubWorkflowModel, SyshubWorkflowReference, SyshubWorkflowVersion } from 'syshub-rest-module';

@Component({
  selector: 'app-workflow-ui',
  templateUrl: './workflow-ui.component.html',
  styleUrl: './workflow-ui.component.scss'
})
export class WorkflowUiComponent implements OnDestroy, OnInit {

  apiError?: Error;
  failedState: 'noUuid' | 'noCache' | 'apiError' | null = null;
  highlightWorkflowRef: string = '';
  loaded: boolean = false;
  model?: SyshubWorkflowModel;
  nodesCache: { [key: string]: SyshubConfigItem | SyshubJobType | SyshubWorkflow | SyshubPSetItem | null } = {};
  nodesToggled: string[] = [];
  progress: number = 0;
  references?: SyshubWorkflowReferenceGroup[];
  referencesCount: number = 0;
  searchResult?: SearchResult;
  startpoints?: string[];
  subs: Subscription[] = [];
  sysHUB2022CompatibilityMode: boolean = false;
  versions?: SyshubWorkflowVersion[];
  workflow?: SyshubWorkflow;
  workflowUuid?: string;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    initService: AppInitService,
    private propsService: PagepropsService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private toastsService: ToastsService,
    private restapi: RestService,
  ) {
    this.sysHUB2022CompatibilityMode = initService.environment.api.version == 2;
  }

  getWorkflowByName(name: string): SyshubWorkflow | null {
    return this.cacheService.getWorkflowByName(name);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  debounce: any;
  ngOnInit(): void {
    this.subs.push(this.cacheService.searchresult.subscribe((result) => this.searchResult = result ?? undefined));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      if (!map.has('uuid')) {
        this.failedState = 'noUuid';
        this.toastsService.addDangerToast({ message: this.l10nphrase.workflowUi.failedCommon + this.l10nphrase.workflowUi.failed.noUuid, autohide: false });
        return;
      }
      if (map.has('t')) {
        this.cacheService.loadSearchResult(map.get('t')!);
      }
      if (map.has('highlight')) {
        this.highlightWorkflowRef = map.get('highlight')!;
      }
      this.workflowUuid = map.get('uuid') ?? undefined;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.ngOnInit_LoadWf()
      }, 100);
    }));
    this.cacheService.WorkflowsUpdated.subscribe(() => {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.ngOnInit_LoadWf()
      }, 100);
    });
    this.subs.push(this.searchService.searchBusy.subscribe((state) => this.loaded = this.progress === 100 && this.workflow !== undefined));
  }

  ngOnInit_LoadWf(): void {
    if (this.workflowUuid == undefined)
      return;
    const tempworkflow = this.cacheService.getWorkflow(this.workflowUuid);
    if (tempworkflow == null)
      return;
    if (this.workflow != undefined && JSON.stringify(this.workflow) === JSON.stringify(tempworkflow))
      return;

    this.ngOnInit_ReportProgress();
    this.workflow = { ...tempworkflow };

    if (!this.sysHUB2022CompatibilityMode) {
      this.subs.push(this.restapi.getWorkflowReferences(tempworkflow.uuid).subscribe((reply) => {
        if (reply instanceof Error) {
          this.toastsService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
            autohide: false
          });
          this.failedState = 'apiError';
          this.apiError = { ...reply };
        }
        else {
          let temprefs: { [key: string]: SyshubWorkflowReferenceGroup } = {};
          reply.forEach((ref) => {
            if (!temprefs[ref.type])
              temprefs[ref.type] = { type: ref.type, items: [] };
            temprefs[ref.type].items.push(ref);
          });
          let temprefs2 = Object.values(temprefs).sort((a, b) => a.type.toLocaleLowerCase() > b.type.toLocaleLowerCase() ? 1 : a.type.toLocaleLowerCase() < b.type.toLocaleLowerCase() ? -1 : 0);
          temprefs2.forEach((group) => {
            group.items = group.items.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 0);
            this.referencesCount += group.items.length;
          });
          this.references = [...temprefs2];
          this.ngOnInit_ReportProgress();
        }
      }));

      this.subs.push(this.restapi.getWorkflowVersions(tempworkflow.uuid).subscribe((reply) => {
        if (reply instanceof Error) {
          this.toastsService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
            autohide: false
          });
          this.failedState = 'apiError';
          this.apiError = { ...reply };
        }
        else {
          // sort versions descending
          this.versions = reply.sort((a, b) => a.major > b.major ? -1 : b.major > a.major ? 1 : a.minor > b.minor ? -1 : b.minor > a.minor ? 1 : 0);
          this.ngOnInit_ReportProgress();
        }
      }));
    }

    this.subs.push(this.restapi.getWorkflowModel(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.model = reply;
        this.ngOnInit_ReportProgress();
      }
    }));

    this.subs.push(this.restapi.getWorkflowStartpoints(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.startpoints = <any>reply === null ? [] : reply;
        this.ngOnInit_ReportProgress();
      }
    }));
  }

  progressDebounce: any;
  private ngOnInit_ReportProgress(): void {
    clearTimeout(this.progressDebounce);
    this.progressDebounce = setTimeout(() => {
      if (this.sysHUB2022CompatibilityMode) {
        this.progress = Math.floor(((this.workflow != undefined ? 1 : 0) +
          (this.startpoints != undefined ? 1 : 0) +
          (this.model != undefined ? 1 : 0)) * 33.34);
      } else {
        this.progress = Math.floor(((this.workflow != undefined ? 1 : 0) +
          (this.versions != undefined ? 1 : 0) +
          (this.references != undefined ? 1 : 0) +
          (this.startpoints != undefined ? 1 : 0) +
          (this.model != undefined ? 1 : 0)) * 20);
      }
      this.searchService.setProgress(this.progress);
      if (this.progress < 100)
        this.ngOnInit_ReportProgress();
    }, 100);
  }

  hoverNode(type: 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems', path: string, event: MouseEvent): void {
    let node: SyshubConfigItem | SyshubJobType | SyshubWorkflow | SyshubPSetItem | null = null;
    if (this.nodesCache[`${type}-${path}`] === undefined) {
      switch (type) {
        case 'ConfigItems':
          node = this.cacheService.getConfigItemByPath(path);
          break;
        case 'JobTypes':
          node = this.cacheService.getJobtypeByName(path);
          break;
        case 'PSetItems':
          node = this.cacheService.getPsetItemByPath(path);
          break;
        case 'WorkflowItems':
          node = this.cacheService.getWorkflowByName(path);
          break;
      }
      this.nodesCache[`${type}-${path}`] = node;
    }
    else
      node = this.nodesCache[`${type}-${path}`];

    if (node != null) {
      this.propsService.inspect(type, node, 'show', {
        top: event.pageY - 122,
        right: 470,
      });
    }
  }

  leaveNode(type: 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems', path: string): void {
    if (this.nodesCache[`${type}-${path}`] === undefined)
      return;
    let node = this.nodesCache[`${type}-${path}`];
    if (node == null || this.nodesToggled.includes(node.uuid))
      return;
    this.propsService.inspect(type, node, 'remove');
  }

  selectNode(type: 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems', path: string): void {
    if (this.nodesCache[`${type}-${path}`] === undefined)
      return;
    let node = this.nodesCache[`${type}-${path}`];
    if (node == null)
      return;
    if (!this.nodesToggled.includes(node.uuid))
      this.nodesToggled.push(node.uuid);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.uuid, 1));
  }

}

export type SyshubWorkflowReferenceGroup = {
  type: string,
  items: SyshubWorkflowReference[],
}