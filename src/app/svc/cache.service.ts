import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEqual, parseISO } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService, SyshubCategory, SyshubConfigItem, SyshubJobType, SyshubPSetItem, SyshubWorkflow } from 'syshub-rest-module';
import { L10nService } from './i10n.service';
import { ToastsService } from './toasts.service';
import { SearchConfig, SearchResult, SearchResultUuids, UserConfig, UuidModifiedTypeObject } from '../types';

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
   * Contains the sysHUB config items as an array with children inside.
   */
  public Config = this.config$.asObservable();

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

  private _jobtypes: BehaviorSubject<SyshubJobType[]> = new BehaviorSubject<SyshubJobType[]>([]);
  private jobtypesIndex: { [key: string]: number } = {};
  private jobtypesLoaded = false;
  public jobtypes = this._jobtypes.asObservable();

  private _parameterset: BehaviorSubject<SyshubPSetItem[]> = new BehaviorSubject<SyshubPSetItem[]>([]);
  private parametersetItems: { [key: string]: SyshubPSetItem } = {};
  private parametersetModifiedTimeIndex: { [key: string]: string } = {};
  private parametersetLoaded = false;
  public parameterset = this._parameterset.asObservable();

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
    private i10nService: L10nService,
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
    this._jobtypes.next([]);
    this._parameterset.next([]);
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

  /* 

  getIcon(type: string, value: any = null, fallback: string = 'folder'): string {
    switch (type) {
      case 'Boolean': return value === true || value === 'true' ? 'radio_button_checked' : 'radio_button_unchecked';
      case 'Cron Expression': return 'av_timer';
      case 'File': return 'file';
      case 'FileSystem Path': return 'folder_open';
      case 'Group/Folder': return 'account_tree';
      case 'Integer': return '123';
      case 'Password': return 'password';
      case 'Roles': return 'group';
      case 'String': return 'format_size';
      case 'Workflow-UUID': return 'memory';
    }
    return fallback;
  }

  getJobtype(uuid: string): SyshubJobType | null {
    return this.jobtypesIndex[uuid] != undefined ? this._jobtypes.value[this.jobtypesIndex[uuid]] : null;
  }

  getParametersetItem(uuid: string): SyshubPSetItem | null {
    return this.parametersetItems[uuid] ?? null;
  } */

  getWorkflow(uuid: string): SyshubWorkflow | null {
    return this.workflowsIndex[uuid] != undefined ? this._workflows.value[this.workflowsIndex[uuid]] : null;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
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
    this.jobtypes.subscribe((jobtypes) => {
      if (this.jobtypesLoaded && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes', JSON.stringify(jobtypes));
      let indexed: { [key: string]: number } = {};
      jobtypes.forEach((type, i) => indexed[type.uuid] = i);
      this.jobtypesIndex = indexed;
    });
    let olddata = localStorage.getItem(environment.storage?.jobtypesKey ?? 'findr-syshub-jobtypes');
    if (olddata != null)
      this._jobtypes.next(<SyshubJobType[]>JSON.parse(olddata));
    else
      this.reloadJobtypes();
    this.jobtypesLoaded = true;
  }

  private loadParametersetCache(): void {
    this.parameterset.subscribe((parameterset) => {
      if (this.parametersetLoaded && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.parametersetKey ?? 'findr-syshub-parameterset', JSON.stringify(parameterset));
      this.parametersetItems = {};
      this.parametersetModifiedTimeIndex = this.loadParametersetCacheIndex(parameterset);
    });
    let olddata = localStorage.getItem(environment.storage?.parametersetKey ?? 'findr-syshub-parameterset');
    if (olddata != null)
      this._parameterset.next(<SyshubPSetItem[]>JSON.parse(olddata));
    else
      this.reloadParameterset();
    this.parametersetLoaded = true;
  }

  private loadParametersetCacheIndex(parameterset: SyshubPSetItem[], parentpath: string = '', parentpath2copy: string = '', parent?: SyshubPSetItem): { [key: string]: string } {
    let indexed: { [key: string]: string } = {};
    parameterset.forEach((parameterset) => {
      /* parameterset.path = `${parentpath}${parentpath != '' ? '/' : ''}${parameterset.name}${parameterset.type == 'Group/Folder' && parameterset.value != '' ? ': ' + parameterset.value : ''}`;
      parameterset.path2copy = `${parentpath2copy}${parentpath2copy != '' ? '/' : ''}${parameterset.name}`;
      parameterset.parentRef = parent;
      indexed[parameterset.uuid] = parameterset.modifiedtime;
      if (parameterset.children.length > 0)
        indexed = { ...indexed, ...this.loadParametersetCacheIndex(parameterset.children, parameterset.path, parameterset.path2copy, parameterset) };
      this.parametersetItems[parameterset.uuid] = parameterset; */
    });
    return indexed;
  }

  loadSubscriptions(): void {
    this.loadSubscriptions_Categories();
    this.loadSubscriptions_Config();
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
      this.configUuid2Ref$ = indexed;
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
        this.toastService.addDangerToast({
          message: this.l10n('api.errorCommon', [reply.message])
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
        this.toastService.addDangerToast({
          message: this.l10n('api.errorCommon', [reply.message])
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
    let svc = this;
    this.restapi.get('jobtype/list').subscribe({
      next(value: any): void {
        //svc._jobtypes.next((<RestApiJobtypeListReply>value).children.sort((a, b) => a.name > b.name ? 1 : -1));
      },
      error(err: HttpErrorResponse): void {
        /* svc.snackBar.open(
          svc.i10n('api.errorCommon', [err.message]),
          svc.i10n('common.phrases.okUc'), {
          panelClass: ['error-snack'],
        }); */
        return;
      },
    });
  }

  reloadParameterset(): void {
    let svc = this;
    this.restapi.get('parameterset/children?maxDeep=0').subscribe({
      next(value: any): void {
        svc._parameterset.next((<SyshubPSetItem[]>value).sort((a, b) => a.name > b.name ? 1 : -1));
      },
      error(err: HttpErrorResponse): void {
        /* svc.snackBar.open(
          svc.i10n('api.errorCommon', [err.message]),
          svc.i10n('common.phrases.okUc'), {
          panelClass: ['error-snack'],
        }); */
        return;
      },
    });
  }

  reloadWorkflows(): void {
    let svc = this;
    this.restapi.get('workflows').subscribe({
      next(value: any): void {
        svc._workflows.next((<SyshubWorkflow[]>value).sort((a, b) => a.name > b.name ? 1 : -1));
      },
      error(err: HttpErrorResponse): void {
        /* svc.snackBar.open(
          svc.i10n('api.errorCommon', [err.message]),
          svc.i10n('common.phrases.okUc'), {
          panelClass: ['error-snack'],
        }); */
        return;
      },
    });
  }

  setResult(token: string, result: SearchResultUuids): void {
    if (!this._searchresult.value || this._searchresult.value!.search.token != token)
      return;
    this._searchresult.value.result = { ...result };
    this.setResult_reloadOutdatedItems(this._searchresult.value.result);
  }

  setResult_reloadOutdatedItems(result: SearchResultUuids): void {
    let configUpdated = false, parametersetUpdated = false, workflowsUpdated = false;
    console.log(result);
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
        if (this.parametersetModifiedTimeIndex[obj.uuid] == undefined) {
          parametersetUpdated = true;
          this.reloadParameterset();
        } else {
          if (!isEqual(parseISO(obj.modifiedtime), parseISO(this.parametersetModifiedTimeIndex[obj.uuid]))) {
            parametersetUpdated = true;
            this.reloadParameterset();
          }
        }
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
