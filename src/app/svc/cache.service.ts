import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NetworkError, RestService, SyshubCategory, SyshubConfigItem, SyshubJobType, SyshubPSetItem, SyshubWorkflow, UnauthorizedError } from 'syshub-rest-module';
import { SearchConfig, SearchResult, SearchResultUuids, UserConfig, UuidModifiedTypeObject } from '../types';
import { L10nService } from './i10n.service';
import { L10nLocale } from './i10n/l10n-locale';
import { ToastsService } from './toasts.service';

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

  /**
   * Holds information about previous searches (0 = search token, 1 = phrase).
   * This is persisted to sessionStorage and used to remove oldest entries if sessionstorage quota is exceeded.
   */
  private searchhistory: [number, string][] = [];

  /**
   * Contains the current loaded search result to be shown on the website.
   */
  private _searchresult: BehaviorSubject<SearchResult | null> = new BehaviorSubject<SearchResult | null>(null);

  /**
   * Subscribe to get the current search configuration and result.
   */
  public searchresult = this._searchresult.asObservable();

  /**
   * Object to keep track of the current modification time of objects.
   */
  private uuids: { [key: string]: UuidModifiedTypeObject } = {};

  /**
   * Contains Findr specific page settings that are persisted in the browser cache.
   */
  private _userconfig: BehaviorSubject<UserConfig> = new BehaviorSubject<UserConfig>({ enableCache: environment.app?.useCache ?? true });

  /**
   * Tracks whether user settings have been loaded.
   */
  private userconfigLoaded = false;

  /**
   * Subscribe to get the user settings as soon as they have been loaded.
   */
  public userconfig = this._userconfig.asObservable();

  /**
   * Contains the workflows as an array in a subscribable subject.
   */
  private workflows$: BehaviorSubject<SyshubWorkflow[]> = new BehaviorSubject<SyshubWorkflow[]>([]);

  /**
   * Contains a subscribable subject that is updated after workflows have been reloaded and all recalculations have been done.
   */
  private workflowsUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
   * Contains the workflows as an array.
   */
  public Workflows = this.workflows$.asObservable();

  /**
   * Contains a subscribable subject that is updated after workflows have been reloaded and all recalculations have been done.
   */
  public WorkflowsUpdated = this.workflowsUpdated$.asObservable();

  /**
   * Saves the uuid of a workflow together with the index from the workflows$ array.
   */
  private workflowUuid2Index$: { [key: string]: number } = {};

  /**
   * Saves whether the workflows have already been initially loaded from the browser cache.
   */
  private workflowsLoaded$ = false;

  /**
   * Tracks whether an user is logged in to the Rest API.
   */
  private userIsLoggedin$: boolean | null = null;

  constructor(
    private l10nService: L10nService,
    private restapi: RestService,
    private toastService: ToastsService,) {
    this.loadSubscriptions();
  }

  /**
   * Clears the local storage and forces a full cache reload.
   */
  public clear(): void {
    this.clearInternal(true);
  }

  /**
   * Clears the local storage and forces a full cache reload.
   */
  private clearInternal(reload?: boolean, fullclear?: boolean): void {
    this.categories$.next([]);
    this.config$.next([]);
    this.jobtypes$.next([]);
    this.parameterset$.next([]);
    this.workflows$.next([]);
    this._searchresult.next(null);
    localStorage.removeItem(environment.storage?.categoriesKey ?? 'findr-syshub-cat');
    localStorage.removeItem(environment.storage?.configKey ?? 'findr-syshub-config');
    localStorage.removeItem(environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes');
    localStorage.removeItem(environment.storage?.configKey ?? 'findr-syshub-parameterset');
    localStorage.removeItem(environment.storage?.workflowsKey ?? 'findr-syshub-workflows');
    localStorage.removeItem(environment.storage?.searchconfigKey ?? 'findr-syshub-searchconfig');
    if (fullclear) {
      sessionStorage.clear();
    }
    if (reload)
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

  getConfigTree(uuid: string | null, includeUuids: boolean = false): string {
    if (uuid == null)
      return '';
    const item = this.getConfigItemByUuid(uuid);
    if (item == null)
      return '';
    if (item.parent == null)
      return item.name + (includeUuids ? `[${item.uuid}]` : '');
    return `${this.getConfigTree(item.parent, includeUuids)} / ${item.name}` + (includeUuids ? `[${item.uuid}]` : '');
  }

  getIcon(type: string, value: any = null, fallback: string = 'bi-folder'): string {
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

  getPsetTree(uuid: string | null, includeUuids: boolean = false): string {
    if (uuid == null)
      return '';
    const item = this.getPsetItemByUuid(uuid);
    if (item == null)
      return '';
    if (item.parent == null)
      return item.name + (includeUuids ? `[${item.uuid}]` : '');
    return `${this.getPsetTree(item.parent, includeUuids)} / ${item.name}` + (includeUuids ? `[${item.uuid}]` : '');
  }

  loadSearchResult(token: string): boolean {
    let result: string | null = sessionStorage.getItem(token);
    if (result !== null) {
      this._searchresult.next(<SearchResult>JSON.parse(result));
      this.loadSearchResult_reloadOutdatedItems(this._searchresult.value!.result!);
      return true;
    }
    return false;
  }

  /**
   * Reload outdated entities if modifiedtime has changed since last reload.
   * This is called when loading a search result from the cache. 
   * @param result The search result entities
   */
  loadSearchResult_reloadOutdatedItems(result: SearchResultUuids): void {
    let configUpdated = false, parametersetUpdated = false, workflowsUpdated = false;
    result.config.forEach((obj) => {
      if (!configUpdated)
        if (this.uuids[obj.uuid] == undefined || this.uuids[obj.uuid].modifiedtime !== obj.modifiedtime) {
          configUpdated = true;
          this.reloadConfig();
        }
    });
    result.parameterset.forEach((obj) => {
      if (!parametersetUpdated)
        if (this.uuids[obj.uuid] == undefined || this.uuids[obj.uuid].modifiedtime !== obj.modifiedtime) {
          parametersetUpdated = true;
          this.reloadParameterset();
        }
    });
    result.workflows.forEach((obj) => {
      if (!workflowsUpdated)
        if (this.uuids[obj.uuid] == undefined || this.uuids[obj.uuid].modifiedtime !== obj.modifiedtime) {
          workflowsUpdated = true;
          this.reloadWorkflows();
        }
    });
    // Limitation: As jobtypes do not contain modifiedtime we reload them after search result contains at least one jobtype
    if (result.jobtypes.length > 0)
      this.reloadJobtypes();
  }

  getWorkflow(uuid: string): SyshubWorkflow | null {
    return this.workflowUuid2Index$[uuid] != undefined ? this.workflows$.value[this.workflowUuid2Index$[uuid]] : null;
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  private loadCache(): void {
    this.loadSearchesCache();
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
    let olddata = localStorage.getItem(environment.storage?.parametersetKey ?? 'findr-syshub-parameterset');
    if (olddata != null)
      this.parameterset$.next(<SyshubPSetItem[]>JSON.parse(olddata));
    this.reloadParameterset();
    this.parametersetLoaded$ = true;
  }

  private loadSearchesCache(): void {
    let olddata = sessionStorage.getItem('findr-history');
    if (olddata != null) {
      this.searchhistory = (<[number, string][]>JSON.parse(olddata)).sort((a, b) => a[0] - b[0]);
    }
  }

  loadSubscriptions(): void {
    this.restapi.isLoggedIn.subscribe((state) => {
      if (state === false && this.userIsLoggedin$ === true) {
        this.clearInternal(false, true);
      }
      this.userIsLoggedin$ = state;
      if (state === true) {
        this.loadCache();
      }
    })
    this.loadSubscriptions_Categories();
    this.loadSubscriptions_Config();
    this.loadSubscriptions_Jobtypes();
    this.loadSubscriptions_PSet();
    this.loadSubscriptions_Workflows();
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
      configitems = configitems.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
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
    cfg.children = cfg.children.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? -1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? 1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
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
      parameterset = parameterset.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
      if (this.parametersetLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.parametersetKey ?? 'findr-syshub-parameterset', JSON.stringify(parameterset));
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
    item.children = item.children.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  loadSubscriptions_Workflows(): void {
    this.Workflows.subscribe((workflows) => {
      if (this.workflowsLoaded$ && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.workflowsKey ?? 'findr-syshub-workflows', JSON.stringify(workflows));
      let indexed: { [key: string]: number } = {};
      workflows.forEach((wf, i) => {
        indexed[wf.uuid] = i;
        this.uuids[wf.uuid] = {
          uuid: wf.uuid,
          modifiedtime: wf.modifiedTime,
          type: 'SyshubWorkflow'
        }
      });
      this.workflowUuid2Index$ = indexed;
      this.workflowsUpdated$.next(Date.now());
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
    let olddata = localStorage.getItem(environment.storage?.workflowsKey ?? 'findr-syshub-workflows');
    if (olddata != null)
      this.workflows$.next(<SyshubWorkflow[]>JSON.parse(olddata));
    else
      this.reloadWorkflows();
    this.workflowsLoaded$ = true;
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
        if (reply instanceof UnauthorizedError)
          return;
        this.toastService.addDangerToast({
          message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
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
        if (reply instanceof UnauthorizedError)
          return;
        this.toastService.addDangerToast({
          message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
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
        if (reply instanceof UnauthorizedError)
          return;
        this.toastService.addDangerToast({
          message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
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
        if (reply instanceof UnauthorizedError)
          return;
        this.toastService.addDangerToast({
          message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
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
        if (reply instanceof UnauthorizedError)
          return;
        this.toastService.addDangerToast({
          message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
        });
        return;
      }
      this.workflows$.next([...reply].sort((a, b) => a.name > b.name ? 1 : -1));
    });
  }

  private addToSearchHistory(token: string, phrase: string): CacheService {
    this.searchhistory.push([+token, phrase]);
    if (this.searchhistory.length >= 5) {
      const firstitem = this.searchhistory.splice(0, 1);
      firstitem.forEach((item) => {
        try {
          sessionStorage.removeItem(`${item[0]}`);
        } catch (error) { }
      });
    }
    sessionStorage.setItem('findr-history', JSON.stringify(this.searchhistory));
    return this;
  }

  private saveSearchResult(token: string): CacheService {
    sessionStorage.setItem(token, JSON.stringify({ ...this._searchresult.value }));
    return this;
  }

  setResult(token: string, result: SearchResultUuids): void {
    if (!this._searchresult.value || this._searchresult.value!.search.token != token)
      return;
    this._searchresult.value.result = { ...result };
    this.addToSearchHistory(token, this._searchresult.value.search.phrase)
      .saveSearchResult(token);
  }

  showMoreFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.showMoreFilter) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.showMoreFilter = newvalue;
      this._userconfig.next(obj);
    }
  }

  toggleJobtypePropertyFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.hideJobtypePercentItems) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.hideJobtypePercentItems = newvalue;
      this._userconfig.next(obj);
    }
  }

  toggleUnassignedRolesFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.hideUnassignedRoles) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.hideUnassignedRoles = newvalue;
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
