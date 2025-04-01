import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { compress, decompress } from 'lz-string';
import { BehaviorSubject, Subscription, first, forkJoin } from 'rxjs';
import { NetworkError, RestService, SyshubCategory, SyshubConfigItem, SyshubJobType, SyshubPSetItem, SyshubServerInformation, SyshubVersion, SyshubWorkflow, SyshubWorkflowReference, SyshubWorkflowVersion, UnauthorizedError } from 'syshub-rest-module';
import { ConfigType, ConfigTypeMapping, SearchConfig, SearchResult, SearchResultUuids, UserConfig, UuidModifiedTypeObject } from '../types';
import { AppInitService } from './app-init.service';
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
   * Saves whether the config has already been initially loaded from the browser cache.
   */
  private configLoaded$ = false;

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
   * Contains a subscribeable subject that includes dictionary variables (key-value-pairs). This requires a workflow uuid configured
   * in Findr configuration app.loadDictionaryWorkflow, e.g. "c0a80a838fed1172818fed8172ff0000" for the workflow "Findr query dictionary".
   * This workflow is part of the ppk package included in the Findr installation files.
   */
  private dictionaryVariables$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});

  /**
   * Contains a subscribeable subject that includes dictionary variables (key-value-pairs). This requires a workflow uuid configured
   * in Findr configuration app.loadDictionaryWorkflow, e.g. "c0a80a838fed1172818fed8172ff0000" for the workflow "Findr query dictionary".
   * This workflow is part of the ppk package included in the Findr installation files.
   */
  public DictionaryVariables = this.dictionaryVariables$.asObservable();

  /**
  * Contains a subscribeable subject that is update after dictionary variables have been changed.
  */
  private dictionaryVariablesUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  /**
  * Contains a subscribeable subject that is update after dictionary variables have been changed.
  */
  public DictionaryVariablesUpdated = this.dictionaryVariablesUpdated$.asObservable();

  /**
   * Contains the job types as an array in a subscribeable subject.
   */
  private jobtypes$: BehaviorSubject<SyshubJobType[]> = new BehaviorSubject<SyshubJobType[]>([]);

  /**
   * Saves whether the jobtypes have already been initially loaded from the browser cache.
   */
  private jobtypesLoaded$ = false;

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
   * Contains the parameter set items as an array in a subscribeable subject.
   */
  private parameterset$: BehaviorSubject<SyshubPSetItem[]> = new BehaviorSubject<SyshubPSetItem[]>([]);

  /**
   * Saves whether the parameterset has already been initially loaded from the browser cache.
   */
  private parametersetLoaded$ = false;

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

  private refreshingEntities: { [key: string]: boolean } = {};

  private refreshingEntitiesSubject$ = new BehaviorSubject<string[]>([]);
  public RefreshingEntities = this.refreshingEntitiesSubject$.asObservable();

  /**
   * Holds information about previous searches (key = search token, value[0] = phrase, value[1] = search configuration).
   * This is persisted to sessionStorage and used to remove oldest entries if sessionstorage quota is exceeded.
   */
  private searchhistory$ = new BehaviorSubject<{ [key: string]: [string, SearchResult] }>({});
  public SearchHistory = this.searchhistory$.asObservable();

  /**
   * Contains the current loaded search result to be shown on the website.
   */
  private _searchresult: BehaviorSubject<SearchResult | null> = new BehaviorSubject<SearchResult | null>(null);

  /**
   * Subscribe to get the current search configuration and result.
   */
  public searchresult = this._searchresult.asObservable();

  /** 
   * Contains the server information provided by the backend which includes server version, system name, etc.
   */
  private serverInfo$ = new BehaviorSubject<SyshubServerInformation | null>(null);
  public ServerInfo = this.serverInfo$.asObservable();

  private sysHUB2022CompatibilityMode: boolean;

  /**
   * Object to keep track of the current modification time of objects.
   */
  private uuids: { [key: string]: UuidModifiedTypeObject } = {};

  /**
   * Contains Findr specific page settings that are persisted in the browser cache.
   */
  private _userconfig: BehaviorSubject<UserConfig>;

  /**
   * Tracks whether user settings have been loaded.
   */
  private userconfigLoaded = false;

  /**
   * Subscribe to get the user settings as soon as they have been loaded.
   */
  public userconfig;

  /**
   * Contains the workflows as an array in a subscribable subject.
   */
  private workflows$: BehaviorSubject<SyshubWorkflow[]> = new BehaviorSubject<SyshubWorkflow[]>([]);

  /**
   * Saves whether the workflows have already been initially loaded from the browser cache.
   */
  private workflowsLoaded$ = false;

  /**
   * Contains the workflow references (key = workflow uuid) in a subscribable subject.
   */
  private workflowReferences$: BehaviorSubject<{ [key: string]: SyshubWorkflowReference[] }> = new BehaviorSubject<{ [key: string]: SyshubWorkflowReference[] }>({});
  private workflowReferencesUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public workflowReferencesUpdated = this.workflowReferencesUpdated$.asObservable();

  /**
   * Contains the workflow startpoints (key = workflow uuid) in a subscribable subject.
   */
  private workflowStartpoints$: BehaviorSubject<{ [key: string]: string[] }> = new BehaviorSubject<{ [key: string]: string[] }>({});
  private workflowStartpointsUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public workflowStartpointsUpdated = this.workflowStartpointsUpdated$.asObservable();

  /**
   * Contains the workflow versions (key = workflow uuid) in a subscribable subject.
   */
  private workflowVersions$: BehaviorSubject<{ [key: string]: SyshubWorkflowVersion[] }> = new BehaviorSubject<{ [key: string]: SyshubWorkflowVersion[] }>({});
  private workflowVersionsUpdated$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public workflowVersionsUpdated = this.workflowVersionsUpdated$.asObservable();

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
   * Tracks whether an user is logged in to the Rest API.
   */
  private userIsLoggedin$: boolean | null = null;

  constructor(
    private appInitService: AppInitService,
    private l10nService: L10nService,
    private restapi: RestService,
    private toastService: ToastsService) {
    this.sysHUB2022CompatibilityMode = this.appInitService.environment.api.version === SyshubVersion.sysHUB_2022;
    this._userconfig = new BehaviorSubject<UserConfig>({ enableCache: this.appInitService.environment.app?.useCache ?? true });
    this.userconfig = this._userconfig.asObservable();
    this.loadSubscriptions();
  }

  private addToSearchHistory(token: string, phrase: string, searchResult: SearchResult): CacheService {
    this.searchhistory$.value[token] = [phrase, searchResult];
    if (Object.keys(this.searchhistory$.value).length > 5) {
      const firstkey = Object.keys(this.searchhistory$.value).sort((a, b) => a > b ? 1 : -1)[0];
      delete this.searchhistory$.value[firstkey];
    }
    localStorage.setItem('findr-history', JSON.stringify(this.searchhistory$.value));
    return this;
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
  private clearInternal(reload?: boolean): void {
    this.categories$.next([]);
    this.config$.next([]);
    this.dictionaryVariables$.next({});
    this.jobtypes$.next([]);
    this.parameterset$.next([]);
    this.serverInfo$.next(null);
    this.workflows$.next([]);
    this._searchresult.next(null);
    sessionStorage.removeItem(this.appInitService.environment.storage?.categoriesKey ?? 'findr-syshub-cat');
    sessionStorage.removeItem(this.appInitService.environment.storage?.configKey ?? 'findr-syshub-config');
    sessionStorage.removeItem(this.appInitService.environment.storage?.dictionaryKey ?? 'findr-syshub-dictionary');
    sessionStorage.removeItem(this.appInitService.environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes');
    sessionStorage.removeItem(this.appInitService.environment.storage?.parametersetKey ?? 'findr-syshub-parameterset');
    sessionStorage.removeItem(this.appInitService.environment.storage?.workflowsKey ?? 'findr-syshub-workflow');
    localStorage.removeItem(this.appInitService.environment.storage?.searchconfigKey ?? 'findr-syshub-searchconfig');
    localStorage.removeItem('findr-serverinfo');
    if (reload)
      this.loadCache();
  }

  getCatgeory(uuid: string): SyshubCategory | null {
    return this.categoryUuid2Index$[uuid] != undefined ? this.categories$.value[this.categoryUuid2Index$[uuid]] : null;
  }

  getConfigItemByPath(path: string, applyNamedSystem: boolean = false): SyshubConfigItem | null {
    if (applyNamedSystem && this.serverInfo$.value) {
      const out = this.getConfigItemByPath(`NamedSystems/${this.serverInfo$.value.systemName}/${path}`);
      if (out !== null)
        return out;
    }
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

  getJobtypeByName(name: string): SyshubJobType | null {
    for (let i = 0; i < this.jobtypes$.value.length; i++) {
      if (this.jobtypes$.value[i].name === name)
        return this.jobtypes$.value[i];
    }
    return null;
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

  getType(type: string): ConfigType {
    return ConfigTypeMapping[type] ?? ConfigType.Unknown;
  }

  getWorkflow(uuid: string): SyshubWorkflow | null {
    return this.workflowUuid2Index$[uuid] != undefined ? this.workflows$.value[this.workflowUuid2Index$[uuid]] : null;
  }

  getWorkflowByName(name: string): SyshubWorkflow | null {
    for (let i = 0; i < this.workflows$.value.length; i++) {
      if (this.workflows$.value[i].name === name)
        return this.workflows$.value[i];
    }
    return null;
  }

  getWorkflows(): SyshubWorkflow[] {
    return this.workflows$.value;
  }

  loadSearchResult(token: string): boolean {
    if (this.searchhistory$.value[token]) {
      this._searchresult.next(this.searchhistory$.value[token][1]);
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

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  private loadCache(): void {
    this.loadServerInfo();
    this.loadSearchesCache();
    this.loadUserConfig();
    this.loadCategoriesCache();
    this.loadConfigCache();
    this.loadJobtypesCache();
    this.loadParametersetCache();
    this.loadWorkflowCache();
    this.loadDictionaryCache();
  }

  private loadCategoriesCache(): void {
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.categoriesKey ?? 'findr-syshub-cat');
    if (olddata != null) {
      try {
        this.categories$.next(<SyshubCategory[]>JSON.parse(decompress(olddata)));
      } catch (error) {
        console.error('Failed to decompress categories data:', error);
      }
    }
    this.categoriesLoaded$ = true;
    this.reloadCategories();
  }

  private loadConfigCache(): void {
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.configKey ?? 'findr-syshub-config');
    if (olddata != null) {
      try {
        this.config$.next(<SyshubConfigItem[]>JSON.parse(decompress(olddata)));
      } catch (error) {
        console.error('Failed to decompress config data:', error);
      }
    }
    this.configLoaded$ = true;
    this.reloadConfig();
  }

  private loadDictionaryCache(): void {
    if (!this.appInitService.environment.app?.loadDictionaryWorkflow)
      return;
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.dictionaryKey ?? 'findr-syshub-dictionary');
    if (olddata != null) {
      try {
        this.dictionaryVariables$.next(<{ [key: string]: any }>JSON.parse(decompress(olddata)));
      } catch (error) {
        console.error('Failed to decompress dictionaryVariables data:', error);
      }
    }
    this.reloadDictionary();
  }

  private loadJobtypesCache(): void {
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes');
    if (olddata != null) {
      try {
        this.jobtypes$.next(<SyshubJobType[]>JSON.parse(decompress(olddata)));
      } catch (error) {
        console.error('Failed to decompress jobtypes data:', error);
      }
    }
    this.jobtypesLoaded$ = true;
    this.reloadJobtypes();
  }

  private loadParametersetCache(): void {
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.parametersetKey ?? 'findr-syshub-parameterset');
    if (olddata != null) {
      try {
        this.parameterset$.next(<SyshubPSetItem[]>JSON.parse(decompress(olddata)));
      } catch (error) {
        console.error('Failed to decompress parameterset data:', error);
      }
    }
    this.parametersetLoaded$ = true;
    this.reloadParameterset();
  }

  private loadSearchesCache(): void {
    let olddata = localStorage.getItem('findr-history');
    if (olddata != null) {
      this.searchhistory$.next(<{ [key: string]: [string, SearchResult] }>JSON.parse(olddata));
    }
  }

  private loadServerInfo(): void {
    let olddata = localStorage.getItem('findr-serverinfo');
    if (olddata != null) {
      this.serverInfo$.next(<SyshubServerInformation>JSON.parse(olddata));
    }
    setTimeout(() => {
      let sub = this.restapi.getServerInformation(this.serverInfo$ == null).subscribe((info) => {
        if (info != HttpStatusCode.NotModified && !(info instanceof Error)) {
          this.serverInfo$.next({ ...info });
          localStorage.setItem('findr-serverinfo', JSON.stringify(info));
        }
        sub.unsubscribe();
      });
    }, 100);
  }

  loadSubscriptions(): void {
    this.restapi.isLoggedIn.subscribe((state) => {
      if (state === false && this.userIsLoggedin$ === true) {
        this.clearInternal(false);
      }
      this.userIsLoggedin$ = state;
      if (state === true) {
        this.loadCache();
      }
    })
    this.loadSubscriptions_Categories();
    this.loadSubscriptions_Config();
    this.loadSubscriptions_Dictionary();
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
        sessionStorage.setItem(this.appInitService.environment.storage?.categoriesKey ?? 'findr-syshub-cat', compress(JSON.stringify(categories)));
      this.categoryUuid2Index$ = indexed;
    });
  }

  loadSubscriptions_Config(): void {
    this.Config.subscribe((configitems) => {
      let indexed: { [key: string]: SyshubConfigItem } = {};
      let paths: { [key: string]: string } = {};
      configitems.filter((cfg) => cfg.uuid != '').forEach((cfg, i) => {
        this.loadSubscriptions_ConfigItem(cfg, indexed, paths);
      });
      configitems = configitems.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
      this.configUuid2Ref$ = { ...indexed };
      this.configPath2Uuid$ = { ...paths };
      this.configUpdated$.next(Date.now());
      if (this.configLoaded$)
        sessionStorage.setItem(this.appInitService.environment.storage?.configKey ?? 'findr-syshub-config', compress(JSON.stringify(configitems)));
    });
  }

  loadSubscriptions_ConfigItem(cfg: SyshubConfigItem, indexed: { [key: string]: SyshubConfigItem }, paths: { [key: string]: string }, path: string = ''): void {
    this.uuids[cfg.uuid] = {
      uuid: cfg.uuid,
      modifiedtime: cfg.modifiedtime,
      path: path === '' ? cfg.name : `${path}/${cfg.name}`,
      type: 'SyshubConfigItem'
    }
    indexed[cfg.uuid] = cfg;
    paths[this.uuids[cfg.uuid].path!] = cfg.uuid;
    cfg.children.filter((child) => child.uuid != '').forEach((child, i) => {
      this.loadSubscriptions_ConfigItem(child, indexed, paths, path === '' ? cfg.name : `${path}/${cfg.name}`);
    });
    cfg.children = cfg.children.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? -1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? 1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  loadSubscriptions_Dictionary(): void {
    this.DictionaryVariables.subscribe((dictionary) => {
      this.dictionaryVariablesUpdated$.next(Date.now());
      sessionStorage.setItem(this.appInitService.environment.storage?.dictionaryKey ?? 'findr-syshub-dictionary', compress(JSON.stringify(dictionary)));
    });
  }

  loadSubscriptions_Jobtypes(): void {
    this.Jobtypes.subscribe((jobtypes) => {
      let indexed: { [key: string]: number } = {};
      jobtypes.forEach((type, i) => indexed[type.uuid] = i);
      this.jobtypeUuid2Index$ = indexed;
      this.jobtypesUpdated$.next(Date.now());
      if (this.jobtypesLoaded$)
        sessionStorage.setItem(this.appInitService.environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes', compress(JSON.stringify(jobtypes)));
    });
  }

  loadSubscriptions_PSet(): void {
    this.Parameterset.subscribe((parameterset) => {
      let indexed: { [key: string]: SyshubPSetItem } = {};
      let paths: { [key: string]: string } = {};
      parameterset.filter((item) => item.uuid != '').forEach((item, i) => {
        this.loadSubscriptions_PSetItem(item, indexed, paths);
      });
      parameterset = parameterset.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
      this.parametersetUuid2Ref$ = { ...indexed };
      this.parametersetPath2Uuid$ = { ...paths };
      this.parametersetUpdated$.next(Date.now());
      if (this.parametersetLoaded$)
        sessionStorage.setItem(this.appInitService.environment.storage?.parametersetKey ?? 'findr-syshub-parameterset', compress(JSON.stringify(parameterset)));
    });
  }

  loadSubscriptions_PSetItem(item: SyshubPSetItem, indexed: { [key: string]: SyshubPSetItem }, paths: { [key: string]: string }, path: string = ''): void {
    this.uuids[item.uuid] = {
      uuid: item.uuid,
      modifiedtime: item.modifiedtime,
      path: path === '' ? item.name : `${path}/${item.name}`,
      type: 'SyshubPSetItem'
    }
    indexed[item.uuid] = item;
    paths[this.uuids[item.uuid].path!] = item.uuid;
    item.children.filter((child) => child.uuid != '').forEach((child, i) => {
      this.loadSubscriptions_PSetItem(child, indexed, paths, path === '' ? item.name : `${path}/${item.name}`);
    });
    item.children = item.children.sort((a, b) => a.type == 'Group/Folder' && b.type != 'Group/Folder' ? 1 : b.type == 'Group/Folder' && a.type != 'Group/Folder' ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  loadSubscriptions_Workflows(): void {
    this.Workflows.subscribe((workflows) => {
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
      if (this.workflowsLoaded$)
        sessionStorage.setItem(this.appInitService.environment.storage?.workflowsKey ?? 'findr-syshub-workflow', compress(JSON.stringify(workflows)));
    });
  }

  private loadUserConfig(): void {
    this.userconfig.subscribe((userconfig) => {
      if (this.userconfigLoaded)
        localStorage.setItem(this.appInitService.environment.storage?.userconfigKey ?? 'findr-usercfg', JSON.stringify(userconfig));
    });
    let olddata = localStorage.getItem(this.appInitService.environment.storage?.userconfigKey ?? 'findr-usercfg');
    if (olddata != null)
      this._userconfig.next(<UserConfig>JSON.parse(olddata));
    this.userconfigLoaded = true;
  }

  private loadWorkflowCache(): void {
    let olddata = sessionStorage.getItem(this.appInitService.environment.storage?.workflowsKey ?? 'findr-syshub-workflow');
    if (olddata != null) {
      try {
        this.workflows$.next(<SyshubWorkflow[]>JSON.parse(decompress(olddata)));
        let olddata2 = sessionStorage.getItem('findr-syshub-wfdata');
        if (olddata2 != null) {
          const tempwfdata = <WfAdditionalData>JSON.parse(decompress(olddata2));
          this.workflowReferences$.next(tempwfdata.references);
          this.workflowStartpoints$.next(tempwfdata.startpoints);
          this.workflowVersions$.next(tempwfdata.versions);
        }
      } catch (error) {
        console.error('Failed to decompress parameterset data:', error);
      }
    }
    this.workflowsLoaded$ = true;
    this.reloadWorkflows();
  }

  prepareSearch(search: SearchConfig): string {
    search.token = '' + Math.floor(Date.now() / 1000) / 1000;
    this._searchresult.next({ search: search });
    return search.token;
  }

  reloadCategories(): void {
    if (this.refreshingEntities[this.l10nphrase.result.categories.title] === true)
      return;
    this.setRefreshState(this.l10nphrase.result.categories.title, true);
    this.restapi.getCategories(this.categories$.value.length == 0).subscribe((reply) => {
      if (reply instanceof Error) {
        this.handleReloadError(this.l10nphrase.result.categories.title, reply);
        return;
      }
      if (reply != HttpStatusCode.NotModified)
        this.categories$.next(reply.sort((a, b) => a.name.localeCompare(b.name)));
      this.setRefreshState(this.l10nphrase.result.categories.title, false);
    });
  }

  reloadConfig(): void {
    if (this.refreshingEntities[this.l10nphrase.result.config.title] === true)
      return;
    this.setRefreshState(this.l10nphrase.result.config.title, true);
    this.restapi.getConfigChildren('', undefined, this.config$.value.length == 0).subscribe((reply) => {
      if (reply instanceof Error) {
        this.handleReloadError(this.l10nphrase.result.config.title, reply);
        return;
      }
      if (reply != HttpStatusCode.NotModified)
        this.config$.next(this.reloadConfig_SortChilds(reply));
      this.setRefreshState(this.l10nphrase.result.config.title, false);
    });
  }

  reloadConfig_SortChilds(items: SyshubConfigItem[]): SyshubConfigItem[] {
    items.forEach((cfg) => {
      cfg.children = this.reloadConfig_SortChilds(cfg.children);
    });
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  reloadDictionary(): void {
    if (!this.appInitService.environment.app?.loadDictionaryWorkflow || this.refreshingEntities['dictionaryVariables'] === true)
      return;
    this.setRefreshState('dictionaryVariables', true);
    let tempsub = this.restapi.runWorkflow(this.appInitService.environment.app.loadDictionaryWorkflow, false).subscribe((reply) => {
      if (reply instanceof Error || reply[1] !== HttpStatusCode.Created) {
        this.handleReloadError('dictionaryVariables', reply instanceof Error ? reply : null, false, tempsub)
        return;
      }
      const match = reply[0].match(/^\/v3\/workflows\/execute\/(?<uuid>[A-Z0-9\-]*)/);
      if (!match || !match.groups || !match.groups['uuid']) {
        this.handleReloadError('dictionaryVariables', null, false, tempsub)
        return;
      }

      tempsub.unsubscribe();

      setTimeout(() => {
        tempsub = this.restapi.getWorkflowExecution(match.groups!['uuid'], true, '%').subscribe((reply) => {
          if (reply instanceof Error || reply === HttpStatusCode.NotModified || reply.dictionary === null || reply.status != 'COMPLETED') {
            this.handleReloadError('dictionaryVariables', reply instanceof Error ? reply : null, false, tempsub)
            return;
          }
          this.dictionaryVariables$.next({ ...reply.dictionary });
          tempsub.unsubscribe();
          this.setRefreshState('dictionaryVariables', false);
        });
      }, 100);
    });
  }

  reloadJobtypes(): void {
    if (this.refreshingEntities[this.l10nphrase.result.jobtype.title] === true)
      return;
    this.setRefreshState(this.l10nphrase.result.jobtype.title, true);
    this.restapi.getJobTypes(this.jobtypes$.value.length == 0).subscribe((reply) => {
      if (reply instanceof Error) {
        this.handleReloadError(this.l10nphrase.result.jobtype.title, reply);
        return;
      }
      if (reply != HttpStatusCode.NotModified)
        this.jobtypes$.next([...reply].sort((a, b) => a.name.localeCompare(b.name)));
      this.setRefreshState(this.l10nphrase.result.jobtype.title, false);
    });
  }

  reloadParameterset(): void {
    if (this.refreshingEntities[this.l10nphrase.result.parameterset.title] === true)
      return;
    this.setRefreshState(this.l10nphrase.result.parameterset.title, true);
    this.restapi.getPsetChildren('', undefined, this.parameterset$.value.length == 0).subscribe((reply) => {
      if (reply instanceof Error) {
        this.handleReloadError(this.l10nphrase.result.parameterset.title, reply);
        return;
      }
      if (reply != HttpStatusCode.NotModified)
        this.parameterset$.next(this.reloadParameterset_SortChilds(reply));
      this.setRefreshState(this.l10nphrase.result.parameterset.title, false);
    });
  }

  reloadParameterset_SortChilds(items: SyshubPSetItem[]): SyshubPSetItem[] {
    items.forEach((item) => {
      item.children = this.reloadParameterset_SortChilds(item.children);
    });
    return items.sort((a, b) => a.name.toLocaleLowerCase() + (a.value?.toLocaleLowerCase() ?? '') > b.name.toLocaleLowerCase() + (b.value?.toLocaleLowerCase() ?? '') ? 1 : -1);
  }

  reloadWorkflows(): void {
    if (this.refreshingEntities[this.l10nphrase.result.workflow.title] === true)
      return;
    this.setRefreshState(this.l10nphrase.result.workflow.title, true);
    this.restapi.getWorkflows({}, this.workflows$.value.length == 0).subscribe((reply) => {
      if (reply instanceof Error) {
        this.handleReloadError(this.l10nphrase.result.workflow.title, reply);
        return;
      }
      if (reply != HttpStatusCode.NotModified) {
        this.workflows$.next([...reply].sort((a, b) => a.name.localeCompare(b.name)));
        this.reloadWorkflowAdditionalInfos(this.workflows$.value);
      }
      this.setRefreshState(this.l10nphrase.result.workflow.title, false);
    });
  }

  private tempWfReferences: { [key: string]: SyshubWorkflowReference[] } = {};
  private tempWfStartpoints: { [key: string]: string[] } = {};
  private tempWfVersions: { [key: string]: SyshubWorkflowVersion[] } = {};
  reloadWorkflowAdditionalInfos(workflows: SyshubWorkflow[], comeback: boolean = false): void {

    if (!comeback) {
      this.tempWfReferences = { ...this.workflowReferences$.value };
      this.tempWfStartpoints = { ...this.workflowStartpoints$.value };
      this.tempWfVersions = { ...this.workflowVersions$.value };
      this.reloadWorkflowAdditionalInfoItem(workflows, 0)
    }

    else {
      this.workflowReferences$.next({ ...this.tempWfReferences });
      this.workflowStartpoints$.next({ ...this.tempWfStartpoints });
      this.workflowVersions$.next({ ...this.tempWfVersions });
      this.tempWfReferences = {};
      this.tempWfStartpoints = {};
      this.tempWfVersions = {};
      sessionStorage.setItem('findr-syshub-wfdata', compress(JSON.stringify(<WfAdditionalData>{
        references: this.workflowReferences$.value,
        startpoints: this.workflowStartpoints$.value,
        versions: this.workflowVersions$.value,
      })));
      this.workflowStartpointsUpdated$.next(Date.now());
      if (!this.sysHUB2022CompatibilityMode) {
        this.workflowReferencesUpdated$.next(Date.now());
        this.workflowVersionsUpdated$.next(Date.now());
      }
    }

  }

  reloadWorkflowAdditionalInfoItem(workflows: SyshubWorkflow[], i: number): void {
    if (workflows[i] == undefined) {
      this.reloadWorkflowAdditionalInfos(workflows, true);
      return;
    }
    if (!this.sysHUB2022CompatibilityMode) {
      forkJoin([
        this.restapi.getWorkflowReferences(workflows[i].uuid, (!this.tempWfReferences[workflows[i].uuid] || this.tempWfReferences[workflows[i].uuid].length == 0)),
        this.restapi.getWorkflowStartpoints(workflows[i].uuid, (!this.tempWfStartpoints[workflows[i].uuid] || this.tempWfStartpoints[workflows[i].uuid].length == 0)),
        this.restapi.getWorkflowVersions(workflows[i].uuid, (!this.tempWfVersions[workflows[i].uuid] || this.tempWfVersions[workflows[i].uuid].length == 0)),
      ]).subscribe({
        next: ([referencesReply, startpointsReply, versionsReply]) => {

          if (referencesReply != HttpStatusCode.NotModified && !(referencesReply instanceof Error))
            this.tempWfReferences[workflows[i].uuid] = [...referencesReply];

          if (startpointsReply != HttpStatusCode.NotModified && !(startpointsReply instanceof Error))
            this.tempWfStartpoints[workflows[i].uuid] = [...startpointsReply];

          if (versionsReply != HttpStatusCode.NotModified && !(versionsReply instanceof Error))
            this.tempWfVersions[workflows[i].uuid] = [...versionsReply];

          this.reloadWorkflowAdditionalInfoItem(workflows, i + 1);
        },
        error: (err) => {
          console.log(workflows[i].uuid, err);
          this.reloadWorkflowAdditionalInfoItem(workflows, i + 1);
        }
      });
    }
    else {
      // sysHUB 2022: do not query references or versions
      forkJoin([
        this.restapi.getWorkflowStartpoints(workflows[i].uuid, (!this.tempWfStartpoints[workflows[i].uuid] || this.tempWfStartpoints[workflows[i].uuid].length == 0)),
      ]).subscribe({
        next: ([startpointsReply]) => {

          if (startpointsReply != HttpStatusCode.NotModified && !(startpointsReply instanceof Error))
            this.tempWfStartpoints[workflows[i].uuid] = [...startpointsReply];

          this.reloadWorkflowAdditionalInfoItem(workflows, i + 1);
        },
        error: (err) => {
          console.log(workflows[i].uuid, err);
          this.reloadWorkflowAdditionalInfoItem(workflows, i + 1);
        }
      });
    }

  }

  private handleReloadError(entity: string, reply: Error | null, showToast: boolean = true, sub?: Subscription): void {
    if (showToast && reply !== null && !(reply instanceof UnauthorizedError))
      this.toastService.addDangerToast({
        message: this.l10n((reply instanceof NetworkError) ? this.l10nphrase.api.failed.serverUnavailable : this.l10nphrase.api.errorCommon, [reply.message])
      });
    this.setRefreshState(entity, false);
    sub?.unsubscribe();
  }

  private setRefreshState(entity: string, isbusy: boolean) {
    this.refreshingEntities[entity] = isbusy;
    this.refreshingEntitiesSubject$.next(Object.keys(this.refreshingEntities).filter((a) => this.refreshingEntities[a] === true))
  }

  setResult(token: string, result: SearchResultUuids): void {
    if (!this._searchresult.value || this._searchresult.value!.search.token != token)
      return;
    this._searchresult.value.result = { ...result };
    this.addToSearchHistory(token, this._searchresult.value.search.phrase, this._searchresult.value);
  }

  showMoreFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.showMoreFilter) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.showMoreFilter = newvalue;
      this._userconfig.next(obj);
    }
  }

  get showUnmatchedItems(): boolean {
    return this._userconfig.value.showUnmatchedItems ?? true;
  }

  toggleJobtypePropertyFilter(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.hideJobtypePercentItems) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.hideJobtypePercentItems = newvalue;
      this._userconfig.next(obj);
    }
  }

  toggleShowPsetTreeInProcessNodes(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.showPsetTreeInProcessNodes) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.showPsetTreeInProcessNodes = newvalue;
      this._userconfig.next(obj);
    }
  }

  toggleShowUnmatchedItems(newvalue: boolean): void {
    if (newvalue !== this._userconfig.value.showUnmatchedItems) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.showUnmatchedItems = newvalue;
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

  workflowReferences(uuid: string): SyshubWorkflowReference[] {
    return this.workflowReferences$.value[uuid] ?? [];
  }

  workflowStartpoints(uuid: string): string[] {
    return this.workflowStartpoints$.value[uuid] ?? [];
  }

  workflowVersions(uuid: string): SyshubWorkflowVersion[] {
    return this.workflowVersions$.value[uuid] ?? [];
  }

  workflowsWithoutReferences(): string[] {
    return Object.keys(this.workflowReferences$.value).filter(key => this.workflowReferences$.value[key].length == 0);
  }

}

export type WfAdditionalData = {
  references: { [key: string]: SyshubWorkflowReference[] },
  startpoints: { [key: string]: string[] },
  versions: { [key: string]: SyshubWorkflowVersion[] },
}
