import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEqual, parseISO } from 'date-fns';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService, SyshubCategory, SyshubConfigItem, SyshubJobType, SyshubPSetItem, SyshubWorkflow, UnauthorizedError } from 'syshub-rest-module';
import { L10nService } from './i10n.service';
import { ToastsService } from './toasts.service';
import { SearchConfig, SearchResult, SearchResultUuids, UserConfig, UuidModifiedTypeObject } from '../types';
import { L10nLocale } from './i10n/l10n-locale';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  /**
   * Contains the sysHUB categories as an array in a subscribeable subject.
   */
  private categories$: BehaviorSubject<SyshubCategory[]> = new BehaviorSubject<SyshubCategory[]>([]);

  /**
   * Contains the sysHUB categories as an array.
   */
  public Categories = this.categories$.asObservable();

  /**
   * Saves the uuid of a category together with its index in the categories$ array.
   */
  private categoryUuid2Index$: { [key: string]: number } = {};

  /**
   * Saves whether the categories have already been initially loaded from the browser cache.
   */
  private categoriesLoaded$ = false;

  /**
   * Contains the sysHUB config items as an array in a subscribeable subject.
   */
  private config$: BehaviorSubject<SyshubConfigItem[]> = new BehaviorSubject<SyshubConfigItem[]>([]);

  /**
   * Contains a subscribeable subject that is update after config has been reloaded and all recalculations have been done.
   */
  private configUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
   * Contains the sysHUB config items as an array with children inside.
   */
  public Config = this.config$.asObservable();

  /**
   * Contains a subscribeable subject that is update after config has been reloaded and all recalculations have been done.
   */
  public ConfigUpdated = this.configUpdated$.asObservable();

  /**
   * Saves the uuid of a config item together with a reference to the object.
   */
  private configUuid2Ref$: { [key: string]: SyshubConfigItem } = {};

  /**
   * Saves the config path with its uuid for each config item.
   */
  private configPath2Uuid$: { [key: string]: string } = {};

  /**
   * Saves whether the config items have already been initially loaded from the browser cache.
   */
  private configLoaded$ = false;

  /**
   * Contains the job types as an array in a subscribeable subject.
   */
  private jobtypes$: BehaviorSubject<SyshubJobType[]> = new BehaviorSubject<SyshubJobType[]>([]);

  /**
   * Contains a subscribeable subject that is updated after job types have been reloaded and all recalculations have been done.
   */
  private jobtypesUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
   * Contains the job types as an array.
   */
  public Jobtypes = this.jobtypes$.asObservable();

  /**
   * Contains a subscribeable subject that is updated after job types have been reloaded and all recalculations have been done.
   */
  public JobtypesUpdated = this.jobtypesUpdated$.asObservable();

  /**
   * Saves the uuid of a job type together with the index from the jobtypes$ array.
   */
  private jobtypeUuid2Index$: { [key: string]: number } = {};

  /**
   * Saves whether the job types have already been initially loaded from the browser cache.
   */
  private jobtypesLoaded$ = false;

  /**
   * Contains the parameter set items as an array in a subscribeable subject.
   */
  private parameterset$: BehaviorSubject<SyshubPSetItem[]> = new BehaviorSubject<SyshubPSetItem[]>([]);

  /**
   * Contains a subscribeable subject that is updated after parameter set has been reloaded and all recalculations have been done.
   */
  private parametersetUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
   * Contains the parameter set items as an array with children inside.
   */
  public Parameterset = this.parameterset$.asObservable();

  /**
   * Contains a subscribeable subject that is updated after parameter set has been reloaded and all recalculations have been done.
   */
  public ParametersetUpdated = this.parametersetUpdated$.asObservable();

  /**
   * Saves the uuid of a parameter set item together with a reference to the object.
   */
  private parametersetUuid2Ref$: { [key: string]: SyshubPSetItem } = {};

  /**
   * Saves the parameter set path with its uuid for each parameter set item.
   */
  private parametersetPath2Uuid$: { [key: string]: string } = {};

  /**
   * Saves whether the parameter set items have already been initially loaded from the browser cache.
   */
  private parametersetLoaded$ = false;

  private uuids: { [key: string]: UuidModifiedTypeObject } = {};

  private _userconfig: BehaviorSubject<UserConfig> = new BehaviorSubject<UserConfig>({ enableCache: environment.app?.useCache ?? true });
  private userconfigLoaded = false;
  public userconfig = this._userconfig.asObservable();

  private _workflows: BehaviorSubject<SyshubWorkflow[]> = new BehaviorSubject<SyshubWorkflow[]>([]);
  private workflowsIndex: { [key: string]: number } = {};
  private workflowsLoaded = false;
  public workflows = this._workflows.asObservable();

  private _searchresult: BehaviorSubject<SearchResult | null> = new BehaviorSubject<SearchResult | null>(null);
  public searchresult = this._searchresult.asObservable();

  constructor(
    private l10nService: L10nService,
    private restapi: RestService,
    private toastService: ToastsService,) {
    this.loadSubscriptions();
    this.loadCache();
  }

  /**
   * Clears the local storage and forces a full cache reload.
   */
  public clear(): void {
    this.categories$.next([]);
    this.config$.next([]);
    this.jobtypes$.next([]);
    this.parameterset$.next([]);
    this._workflows.next([]);
    this._searchresult.next(null);
    localStorage.removeItem(environment.storage?.searchconfigKey ?? 'findr-syshub-searchconfig');
    this.loadCache();
  }

  getCatgeory(uuid: string): SyshubCategory | null {
    return this.categoryUuid2Index$[uuid] != undefined ? this.categories$.value[this.categoryUuid2Index$[uuid]] : null;
  }

  getConfigItemByPath(path: string): SyshubConfigItem | null {
    return this.configPath2Uuid$[path] ? this.getConfigItemByUuid(this.configPath2Uuid$[path]) : null;
  }

  getConfigItemByUuid(uuid: string): SyshubConfigItem | null {
    return this.configUuid2Ref$[uuid] ?? null;
  }

  getConfigTree(uuid: string | null): string {
    if (uuid == null)
      return '';
    const item = this.getConfigItemByUuid(uuid);
    if (item == null)
      return '';
    if (item.parent == null)
      return item.name;
    return `${this.getConfigTree(item.parent)} / ${item.name}`;
  }

  getIcon(type: string, value: any = null, fallback: string = 'bi-folder'): string {
    console.log(type)
    switch (type) {
      case 'Boolean': return value === true || value === 'true' ? 'bi-toggle-on' : 'bi-toggle-off';
      case 'Cron Expression': return 'bi-alarm';
      case 'File': return 'bi-file-binary';
      case 'FileSystem Path': return 'bi-folder2-open';
      case 'Group/Folder': return 'bi-collection';
      case 'Integer': return 'bi-123';
      case 'Password': return 'bi-key';
      case 'Roles': return 'bi-person-check';
      case 'String': return 'bi-body-text';
      case 'Workflow-UUID': return 'bi-fingerprint';
    }
    return fallback;
  }

  getJobtypeByUuid(uuid: string): SyshubJobType | null {
    return this.jobtypeUuid2Index$[uuid] != undefined ? this.jobtypes$.value[this.jobtypeUuid2Index$[uuid]] : null;
  }

  getPsetItemByPath(path: string): SyshubPSetItem | null {
    return this.parametersetPath2Uuid$[path] ? this.getPsetItemByUuid(this.parametersetPath2Uuid$[path]) : null;
  }

  getPsetItemByUuid(uuid: string): SyshubPSetItem | null {
    return this.parametersetUuid2Ref$[uuid] ?? null;
  }

  getPsetTree(uuid: string | null): string {
    if (uuid == null)
      return '';
    const item = this.getPsetItemByUuid(uuid);
    if (item == null)
      return '';
    if (item.parent == null)
      return item.name;
    return `${this.getPsetTree(item.parent)} / ${item.name}`;
  }

  loadSearchResult(token: string): boolean {
    let result: string | null = sessionStorage.getItem(token);
    if (result !== null) {
      this._searchresult.next(<SearchResult>JSON.parse(result));
      this.setResult_reloadOutdatedItems(this._searchresult.value!.result!);
      return true;
    }
    return false;
  }

  getWorkflow(uuid: string): SyshubWorkflow | null {
    return this.workflowsIndex[uuid] != undefined ? this._workflows.value[this.workflowsIndex[uuid]] : null;
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  private loadCache(): void {
    this.loadUserConfig();
    this.loadCategoriesCache();
    this.loadConfigCache();
    this.loadJobtypesCache();
    this.loadParametersetCache();
    this.loadWorkflowCache();
  }

  private loadCategoriesCache(): void {
    let olddata = localStorage.getItem(environment.storage?.categoriesKey ?? 'findr-syshub-cat');
    if (olddata != null)
      this.categories$.next(<SyshubCategory[]>JSON.parse(olddata));
    this.reloadCategories();
    this.categoriesLoaded$ = true;
  }

  private loadConfigCache(): void {
    let olddata = localStorage.getItem(environment.storage?.configKey ?? 'findr-syshub-config');
    if (olddata != null)
      this.config$.next(<SyshubConfigItem[]>JSON.parse(olddata));
    this.reloadConfig();
    this.configLoaded$ = true;
  }

  private loadJobtypesCache(): void {
    let olddata = localStorage.getItem(environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes');
    if (olddata != null)
      this.jobtypes$.next(<SyshubJobType[]>JSON.parse(olddata));
    else
      this.reloadJobtypes();
    this.jobtypesLoaded$ = true;
  }

  private loadParametersetCache(): void {
    let olddata = localStorage.getItem(environment.storage?.configKey ?? 'findr-syshub-parameterset');
    if (olddata != null)
      this.parameterset$.next(<SyshubPSetItem[]>JSON.parse(olddata));
    this.reloadParameterset();
    this.parametersetLoaded$ = true;
  }

  loadSubscriptions(): void {
    this.loadSubscriptions_Categories();
    this.loadSubscriptions_Config();
    this.loadSubscriptions_Jobtypes();
    this.loadSubscriptions_PSet();
  }

  loadSubscriptions_Categories(): void {
    this.Categories.subscribe((categories) => {
      let indexed: { [key: string]: number } = {};
      categories.filter((cat) => cat.uuid != '').forEach((cat, i) => {
        this.uuids[cat.uuid] = {
          uuid: cat.uuid,
          modifiedtime: cat.modifiedtime,
          type: 'SyshubCategory'
        }
        indexed[cat.uuid] = i;
      });
      if (this.categoriesLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.categoriesKey ?? 'findr-syshub-cat', JSON.stringify(categories));
      this.categoryUuid2Index$ = indexed;
    });
  }

  loadSubscriptions_Config(): void {
    this.Config.subscribe((configitems) => {
      let indexed: { [key: string]: SyshubConfigItem } = {};
      configitems.filter((cfg) => cfg.uuid != '').forEach((cfg, i) => {
        this.loadSubscriptions_ConfigItem(cfg, indexed);
      });
      if (this.configLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.configKey ?? 'findr-syshub-config', JSON.stringify(configitems));
      this.configUuid2Ref$ = { ...indexed };
      this.configUpdated$.next(Date.now());
    });
  }

  loadSubscriptions_ConfigItem(cfg: SyshubConfigItem, indexed: { [key: string]: SyshubConfigItem }, path: string = ''): void {
    this.uuids[cfg.uuid] = {
      uuid: cfg.uuid,
      modifiedtime: cfg.modifiedtime,
      path: path === '' ? cfg.name : `${path}/${cfg.name}`,
      type: 'SyshubConfigItem'
    }
    indexed[cfg.uuid] = cfg;
    cfg.children.filter((child) => child.uuid != '').forEach((child, i) => {
      this.loadSubscriptions_ConfigItem(child, indexed, path === '' ? cfg.name : `${path}/${cfg.name}`);
    });
  }

  loadSubscriptions_Jobtypes(): void {
    this.Jobtypes.subscribe((jobtypes) => {
      if (this.jobtypesLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes', JSON.stringify(jobtypes));
      let indexed: { [key: string]: number } = {};
      jobtypes.forEach((type, i) => indexed[type.uuid] = i);
      this.jobtypeUuid2Index$ = indexed;
      this.jobtypesUpdated$.next(Date.now());
    });
  }

  loadSubscriptions_PSet(): void {
    this.Parameterset.subscribe((parameterset) => {
      let indexed: { [key: string]: SyshubPSetItem } = {};
      parameterset.filter((item) => item.uuid != '').forEach((item, i) => {
        this.loadSubscriptions_PSetItem(item, indexed);
      });
      if (this.parametersetLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.configKey ?? 'findr-syshub-parameterset', JSON.stringify(parameterset));
      this.parametersetUuid2Ref$ = { ...indexed };
      this.parametersetUpdated$.next(Date.now());
    });
  }

  loadSubscriptions_PSetItem(item: SyshubPSetItem, indexed: { [key: string]: SyshubPSetItem }, path: string = ''): void {
    this.uuids[item.uuid] = {
      uuid: item.uuid,
      modifiedtime: item.modifiedtime,
      path: path === '' ? item.name : `${path}/${item.name}`,
      type: 'SyshubPSetItem'
    }
    indexed[item.uuid] = item;
    item.children.filter((child) => child.uuid != '').forEach((child, i) => {
      this.loadSubscriptions_PSetItem(child, indexed, path === '' ? item.name : `${path}/${item.name}`);
    });
  }

  private loadUserConfig(): void {
    this.userconfig.subscribe((userconfig) => {
      if (this.userconfigLoaded)
        localStorage.setItem(environment.storage?.userconfigKey ?? 'findr-usercfg', JSON.stringify(userconfig));
    });
    let olddata = localStorage.getItem(environment.storage?.userconfigKey ?? 'findr-usercfg');
    if (olddata != null)
      this._userconfig.next(<UserConfig>JSON.parse(olddata));
    this.userconfigLoaded = true;
  }

  private loadWorkflowCache(): void {
    this.workflows.subscribe((workflows) => {
      if (this.workflowsLoaded && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.workflowsKey ?? 'workflowsKey', JSON.stringify(workflows));
      let indexed: { [key: string]: number } = {};
      workflows.forEach((cat, i) => indexed[cat.uuid] = i);
      this.workflowsIndex = indexed;
    });
    let olddata = localStorage.getItem(environment.storage?.workflowsKey ?? 'workflowsKey');
    if (olddata != null)
      this._workflows.next(<SyshubWorkflow[]>JSON.parse(olddata));
    else
      this.reloadWorkflows();
    this.workflowsLoaded = true;
  }

  prepareSearch(search: SearchConfig): string {
    search.token = '' + Math.floor(Date.now() / 1000) / 1000;
    this._searchresult.next({ search: search });
    return search.token;
  }

  reloadCategories(): void {
    let svc = this;
    this.restapi.getCategories().subscribe((reply) => {
      if (reply instanceof Error) {
        if (!(reply instanceof UnauthorizedError))
          this.toastService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message])
          });
        return;
      }
      this.categories$.next(reply.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    });
  }

  reloadConfig(): void {
    let svc = this;
    this.restapi.getConfigChildren('').subscribe((reply) => {
      if (reply instanceof Error) {
        if (!(reply instanceof UnauthorizedError))
          this.toastService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message])
          });
        return;
      }
      this.config$.next(this.reloadConfig_SortChilds(reply));
    });
  }

  reloadConfig_SortChilds(items: SyshubConfigItem[]): SyshubConfigItem[] {
    items.forEach((cfg) => {
      cfg.children = this.reloadConfig_SortChilds(cfg.children);
    });
    return items.sort((a, b) => a.name.toLocaleLowerCase() + (a.value?.toLocaleLowerCase() ?? '') > b.name.toLocaleLowerCase() + (b.value?.toLocaleLowerCase() ?? '') ? 1 : -1);
  }

  reloadJobtypes(): void {
    this.restapi.getJobTypes().subscribe((reply) => {
      if (reply instanceof Error) {
        if (!(reply instanceof UnauthorizedError))
          this.toastService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message])
          });
        return;
      }
      this.jobtypes$.next([...reply].sort((a, b) => a.name > b.name ? 1 : -1));
    });
  }

  reloadParameterset(): void {
    let svc = this;
    this.restapi.getPsetChildren('').subscribe((reply) => {
      if (reply instanceof Error) {
        if (!(reply instanceof UnauthorizedError))
          this.toastService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message])
          });
        return;
      }
      this.parameterset$.next(this.reloadParameterset_SortChilds(reply));
    });
  }

  reloadParameterset_SortChilds(items: SyshubPSetItem[]): SyshubPSetItem[] {
    items.forEach((item) => {
      item.children = this.reloadParameterset_SortChilds(item.children);
    });
    return items.sort((a, b) => a.name.toLocaleLowerCase() + (a.value?.toLocaleLowerCase() ?? '') > b.name.toLocaleLowerCase() + (b.value?.toLocaleLowerCase() ?? '') ? 1 : -1);
  }

  reloadWorkflows(): void {
    this.restapi.getWorkflows({}).subscribe((reply) => {
      if (reply instanceof Error) {
        if (!(reply instanceof UnauthorizedError))
          this.toastService.addDangerToast({
            message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message])
          });
        return;
      }
      this._workflows.next([...reply].sort((a, b) => a.name > b.name ? 1 : -1));
    });
  }

  setResult(token: string, result: SearchResultUuids): void {
    if (!this._searchresult.value || this._searchresult.value!.search.token != token)
      return;
    this._searchresult.value.result = { ...result };
    sessionStorage.setItem(token, JSON.stringify({ ...this._searchresult.value }));
    this.setResult_reloadOutdatedItems(this._searchresult.value.result);
  }

  setResult_reloadOutdatedItems(result: SearchResultUuids): void {
    let configUpdated = false, parametersetUpdated = false, workflowsUpdated = false;
    console.log('setResult_reloadOutdatedItems', result);
    result.config.forEach((obj) => {
      if (!configUpdated) {
        /* if (this.configModifiedTimeIndex[obj.uuid] == undefined) {
          configUpdated = true;
          this.reloadConfig();
        } else {
          if (!isEqual(parseISO(obj.modifiedtime), parseISO(this.configModifiedTimeIndex[obj.uuid]))) {
            configUpdated = true;
            this.reloadConfig();
          }
        } */
      }
    });
    result.parameterset.forEach((obj) => {
      if (!parametersetUpdated) {
        /* if (this.parametersetModifiedTimeIndex[obj.uuid] == undefined) {
          parametersetUpdated = true;
          this.reloadParameterset();
        } else {
          if (!isEqual(parseISO(obj.modifiedtime), parseISO(this.parametersetModifiedTimeIndex[obj.uuid]))) {
            parametersetUpdated = true;
            this.reloadParameterset();
          }
        } */
      }
    });
    result.workflows.forEach((obj) => {
      if (!workflowsUpdated) {
        if (this.getWorkflow(obj.uuid) == null) {
          workflowsUpdated = true;
          this.reloadWorkflows();
        } else {
          /* if (!this.getWorkflow(obj.uuid)!.modifiedTime || !isEqual(parseISO(this.getWorkflow(obj.uuid)!.modifiedTime), parseISO(this.configModifiedTimeIndex[obj.uuid]))) {
            workflowsUpdated = true;
            this.reloadWorkflows();
          } */
        }
      }
    });
    if (result.jobtypes.length > 1)
      this.reloadJobtypes();
  }

  showMoreFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.showMoreFilter) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.showMoreFilter = newvalue;
      this._userconfig.next(obj);
    }
  }

  useCache(newvalue: boolean): void {
    if (newvalue != this._userconfig.value.enableCache) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.enableCache = newvalue;
      this._userconfig.next(obj);
    }
  }

}
