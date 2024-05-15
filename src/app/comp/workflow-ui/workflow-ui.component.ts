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
import { SearchResult, SimpleKeyValue, VariableSet } from 'src/app/types';
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
  variables: VariableSet = { custom: [], system: [] };
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
    let olddata = localStorage.getItem('findr-wfui-vars');
    if (olddata) {
      try {
        this.variables = JSON.parse(olddata);
      }
      catch { }
    }
  }

  addCustomVariables(name: string, value: string): void {
    let tempvars = { ...this.variables };
    tempvars.custom.push({ key: { varName: name }, value: value, enabled: true });
    this.variables = { ...tempvars };
    this.saveVariables();
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
    this.subs.push(this.cacheService.workflowReferencesUpdated.subscribe((state) => { if (state != null) this.ngOnInit_LoadWfRefs() }));
    this.subs.push(this.cacheService.workflowStartpointsUpdated.subscribe((state) => { if (state != null) this.ngOnInit_LoadWfStartpoints() }));
    this.subs.push(this.cacheService.workflowVersionsUpdated.subscribe((state) => { if (state != null) this.ngOnInit_LoadWfVersions() }));
    this.subs.push(this.cacheService.ConfigUpdated.subscribe((state) => {
      if (state != null) {
        const userVariables = this.cacheService.getConfigItemByPath('System/UserVariables', true);
        if (userVariables != null) {
          this.variables.system = [];
          userVariables?.children.forEach((variableConfigItem) => this.variables.system.push({ key: { varName: variableConfigItem.name }, value: variableConfigItem.value, }));
          this.variables.system.sort((a, b) => a.key.varName!.toLocaleLowerCase().localeCompare(b.key.varName!.toLocaleLowerCase()));
        }
      }
    }));
  }

  ngOnInit_LoadWf(): void {
    if (this.workflowUuid == undefined)
      return;
    const tempworkflow = this.cacheService.getWorkflow(this.workflowUuid);
    if (tempworkflow == null)
      return;
    if (this.workflow != undefined && JSON.stringify(this.workflow) === JSON.stringify(tempworkflow))
      return;

    this.workflow = { ...tempworkflow };

    this.subs.push(this.restapi.getWorkflowModel(tempworkflow.uuid, true).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.model = { ...<SyshubWorkflowModel>reply };
        this.propsService.setPageTitle(this.l10n(this.l10nphrase.workflowUi.title, [this.workflow?.name]))
      }
    }));

    this.ngOnInit_LoadWfRefs();
    this.ngOnInit_LoadWfStartpoints();
    this.ngOnInit_LoadWfVersions();

  }

  ngOnInit_LoadWfRefs(): void {
    if (!this.workflow)
      return
    let refs = this.cacheService.workflowReferences(this.workflow.uuid);
    let temprefs: { [key: string]: SyshubWorkflowReferenceGroup } = {};
    refs.forEach((ref) => {
      if (!temprefs[ref.type])
        temprefs[ref.type] = { type: ref.type, items: [] };
      temprefs[ref.type].items.push(ref);
    });
    let temprefs2 = Object.values(temprefs).sort((a, b) => a.type.toLocaleLowerCase().localeCompare(b.type.toLocaleLowerCase()));
    temprefs2.forEach((group) => {
      group.items = group.items.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
      this.referencesCount += group.items.length;
    });
    this.references = [...temprefs2];
  }

  ngOnInit_LoadWfStartpoints(): void {
    if (!this.workflow)
      return
    this.startpoints = this.cacheService.workflowStartpoints(this.workflow.uuid);
  }

  ngOnInit_LoadWfVersions(): void {
    if (!this.workflow)
      return
    this.versions = this.cacheService.workflowVersions(this.workflow.uuid);
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

  removeCustomVariables(i: number): void {
    if (!this.variables.custom[i])
      return;
    let tempvars = { ...this.variables };
    tempvars.custom.splice(i, 1);
    this.variables = { ...tempvars };
    this.saveVariables();
  }

  saveVariables(): void {
    localStorage.setItem('findr-wfui-vars', JSON.stringify(this.variables));
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

  private updateCustomVariablesDebounce: any;
  updateCustomVariables(i: number): void {
    if (!this.variables.custom[i])
      return;
    clearTimeout(this.updateCustomVariablesDebounce);
    this.updateCustomVariablesDebounce = setTimeout(() => {
      let tempvars = { ...this.variables };
      this.variables = { ...tempvars };
      this.saveVariables();
    }, 500);
  }

}

export type SyshubWorkflowReferenceGroup = {
  type: string,
  items: SyshubWorkflowReference[],
}
