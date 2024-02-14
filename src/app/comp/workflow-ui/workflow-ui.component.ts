import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { RestService, SyshubWorkflow, SyshubWorkflowModel, SyshubWorkflowReference, SyshubWorkflowVersion } from 'syshub-rest-module';

@Component({
  selector: 'app-workflow-ui',
  templateUrl: './workflow-ui.component.html',
  styleUrl: './workflow-ui.component.scss'
})
export class WorkflowUiComponent implements OnDestroy, OnInit {

  failedState: 'noUuid' | 'noCache' | 'apiError' | null = null;
  apiError?: Error;

  loaded: boolean = false;
  progress: number = 0;
  searchResult?: SearchResult;

  moveNodeNextTo: { [key: string]: HTMLElement } = {};
  subs: Subscription[] = [];

  workflow?: SyshubWorkflow;
  model?: SyshubWorkflowModel;
  references?: SyshubWorkflowReferenceGroup[];
  startpoints?: string[];
  versions?: SyshubWorkflowVersion[];
  workflowUuid?: string;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private toastsService: ToastsService,
    private restapi: RestService,
  ) { }

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
        temprefs2.forEach((group) => group.items = group.items.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 0));
        this.references = [...temprefs2];

        //         this.references = reply.sort((a, b) => a.type > b.type ? 1 : a.type < b.type ? -1 : a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
        console.log(this.references)
        this.ngOnInit_ReportProgress();
      }
    }));

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
        this.startpoints = reply;
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

  private ngOnInit_ReportProgress(): void {
    this.progress = ((this.workflow != undefined ? 1 : 0) +
      (this.versions != undefined ? 1 : 0) +
      (this.references != undefined ? 1 : 0) +
      (this.startpoints != undefined ? 1 : 0) +
      (this.model != undefined ? 1 : 0)) * 20;
    this.searchService.setProgress(this.progress);
  }

  selectConfigNode(path: string): void {
    const node = this.cacheService.getConfigItemByPath(path);
    if (node == null)
      return;
    this.propsService.inspect('ConfigItems', node);
  }

  selectJobtypeNode(name: string): void {
    const node = this.cacheService.getJobtypeByName(name);
    if (node == null)
      return;
    this.propsService.inspect('JobTypes', node);
  }

  selectPSetNode(path: string): void {
    const node = this.cacheService.getPsetItemByPath(path);
    if (node == null)
      return;
    this.propsService.inspect('PSetItems', node);
  }

  selectWorkflowNode(name: string): void {
    const node = this.cacheService.getWorkflowByName(name);
    if (node == null)
      return;
    this.propsService.inspect('WorkflowItems', node);
  }

}

export type SyshubWorkflowReferenceGroup = {
  type: string,
  items: SyshubWorkflowReference[],
}