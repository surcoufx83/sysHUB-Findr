import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { fromUnixTime, isEqual, parseISO } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from 'syshub-rest-module';
import { RestApiCategoryListReply, RestApiJobtypeListReply, SearchConfig, SearchResult, SearchResultUuids, SyshubCategory, SyshubConfig, SyshubJobtype, SyshubParameterset, SyshubWorkflow, UserConfig } from '../types';
import { L10nService } from './i10n.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private _categories: BehaviorSubject<SyshubCategory[]> = new BehaviorSubject<SyshubCategory[]>([]);
  private categoriesIndex: { [key: string]: number } = {};
  private categoriesLoaded = false;
  public categories = this._categories.asObservable();
  private _config: BehaviorSubject<SyshubConfig[]> = new BehaviorSubject<SyshubConfig[]>([]);
  private configItems: { [key: string]: SyshubConfig } = {};
  private configModifiedTimeIndex: { [key: string]: string } = {};
  private configLoaded = false;
  public config = this._config.asObservable();
  private _jobtypes: BehaviorSubject<SyshubJobtype[]> = new BehaviorSubject<SyshubJobtype[]>([]);
  private jobtypesIndex: { [key: string]: number } = {};
  private jobtypesLoaded = false;
  public jobtypes = this._jobtypes.asObservable();
  private _parameterset: BehaviorSubject<SyshubParameterset[]> = new BehaviorSubject<SyshubParameterset[]>([]);
  private parametersetItems: { [key: string]: SyshubParameterset } = {};
  private parametersetModifiedTimeIndex: { [key: string]: string } = {};
  private parametersetLoaded = false;
  public parameterset = this._parameterset.asObservable();
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
    /* private snackBar: MatSnackBar */) {
    this.loadCache();
  }

  addSearch(search: SearchConfig): string {
    search.token = '' + Math.floor(Date.now() / 1000) / 1000;
    this._searchresult.next({ search: search });
    return search.token;
  }

  getCatgeory(uuid: string): SyshubCategory | null {
    return this.categoriesIndex[uuid] != undefined ? this._categories.value[this.categoriesIndex[uuid]] : null;
  }

  getConfigItem(uuid: string): SyshubConfig | null {
    return this.configItems[uuid] ?? null;
  }

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

  getJobtype(uuid: string): SyshubJobtype | null {
    return this.jobtypesIndex[uuid] != undefined ? this._jobtypes.value[this.jobtypesIndex[uuid]] : null;
  }

  getParametersetItem(uuid: string): SyshubParameterset | null {
    return this.parametersetItems[uuid] ?? null;
  }

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
    this.categories.subscribe((categories) => {
      if (this.categoriesLoaded && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.categoriesKey ?? 'findr-syshub-cat', JSON.stringify(categories));
      let indexed: { [key: string]: number } = {};
      categories.forEach((cat, i) => indexed[cat.uuid] = i);
      this.categoriesIndex = indexed;
    });
    let olddata = localStorage.getItem(environment.storage?.categoriesKey ?? 'findr-syshub-cat');
    if (olddata != null)
      this._categories.next(<SyshubCategory[]>JSON.parse(olddata));
    else
      this.reloadCategories();
    this.categoriesLoaded = true;
  }

  private loadConfigCache(): void {
    this.config.subscribe((config) => {
      if (this.configLoaded && this._userconfig.value.enableCache)
        localStorage.setItem(environment.storage?.configKey ?? 'findr-syshub-config', JSON.stringify(config));
      this.configItems = {};
      this.configModifiedTimeIndex = this.loadConfigCacheIndex(config);
    });
    let olddata = localStorage.getItem(environment.storage?.configKey ?? 'findr-syshub-config');
    if (olddata != null)
      this._config.next(<SyshubConfig[]>JSON.parse(olddata));
    else
      this.reloadConfig();
    this.configLoaded = true;
  }

  private loadConfigCacheIndex(config: SyshubConfig[], parentpath: string = '', parentpath2copy: string = '', parent?: SyshubConfig): { [key: string]: string } {
    let indexed: { [key: string]: string } = {};
    config.forEach((config) => {
      config.path = `${parentpath}${parentpath != '' ? '/' : ''}${config.name}${config.type == 'Group/Folder' && config.value != '' ? ': ' + config.value : ''}`;
      config.path2copy = `${parentpath2copy}${parentpath2copy != '' ? '/' : ''}${config.name}`;
      config.parentRef = parent;
      indexed[config.uuid] = config.modifiedtime;
      if (config.children.length > 0)
        indexed = { ...indexed, ...this.loadConfigCacheIndex(config.children, config.path, config.path2copy, config) };
      this.configItems[config.uuid] = config;
    });
    return indexed;
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
      this._jobtypes.next(<SyshubJobtype[]>JSON.parse(olddata));
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
      this._parameterset.next(<SyshubParameterset[]>JSON.parse(olddata));
    else
      this.reloadParameterset();
    this.parametersetLoaded = true;
  }

  private loadParametersetCacheIndex(parameterset: SyshubParameterset[], parentpath: string = '', parentpath2copy: string = '', parent?: SyshubParameterset): { [key: string]: string } {
    let indexed: { [key: string]: string } = {};
    parameterset.forEach((parameterset) => {
      parameterset.path = `${parentpath}${parentpath != '' ? '/' : ''}${parameterset.name}${parameterset.type == 'Group/Folder' && parameterset.value != '' ? ': ' + parameterset.value : ''}`;
      parameterset.path2copy = `${parentpath2copy}${parentpath2copy != '' ? '/' : ''}${parameterset.name}`;
      parameterset.parentRef = parent;
      indexed[parameterset.uuid] = parameterset.modifiedtime;
      if (parameterset.children.length > 0)
        indexed = { ...indexed, ...this.loadParametersetCacheIndex(parameterset.children, parameterset.path, parameterset.path2copy, parameterset) };
      this.parametersetItems[parameterset.uuid] = parameterset;
    });
    return indexed;
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

  reloadCategories(): void {
    let svc = this;
    this.restapi.get('category/list').subscribe({
      next(value: any): void {
        svc._categories.next((<RestApiCategoryListReply>value).children.sort((a, b) => a.name > b.name ? 1 : -1));
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

  reloadConfig(): void {
    let svc = this;
    this.restapi.get('config/children?maxDeep=0').subscribe({
      next(value: any): void {
        svc._config.next((<SyshubConfig[]>value).sort((a, b) => a.name > b.name ? 1 : -1));
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

  reloadJobtypes(): void {
    let svc = this;
    this.restapi.get('jobtype/list').subscribe({
      next(value: any): void {
        svc._jobtypes.next((<RestApiJobtypeListReply>value).children.sort((a, b) => a.name > b.name ? 1 : -1));
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
        svc._parameterset.next((<SyshubParameterset[]>value).sort((a, b) => a.name > b.name ? 1 : -1));
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
    this._searchresult.value.result = result;
    this.setResult_reloadOutdatedItems(result);
  }

  setResult_reloadOutdatedItems(result: SearchResultUuids): void {
    let configUpdated = false, parametersetUpdated = false, workflowsUpdated = false;
    result.config.forEach((obj) => {
      if (!configUpdated) {
        if (this.configModifiedTimeIndex[obj.uuid] == undefined) {
          configUpdated = true;
          this.reloadConfig();
        } else {
          if (!isEqual(parseISO(obj.modifiedtime), parseISO(this.configModifiedTimeIndex[obj.uuid]))) {
            configUpdated = true;
            this.reloadConfig();
          }
        }
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
          if (!this.getWorkflow(obj.uuid)!.modifiedTime || !isEqual(parseISO(this.getWorkflow(obj.uuid)!.modifiedTime), parseISO(this.configModifiedTimeIndex[obj.uuid]))) {
            workflowsUpdated = true;
            this.reloadWorkflows();
          }
        }
      }
    });
    if (result.jobtypes.length > 1)
      this.reloadJobtypes();
  }

  useCache(newvalue: boolean): void {
    if (newvalue != this._userconfig.value.enableCache) {
      let obj: UserConfig = { ...this._userconfig.value };
      obj.enableCache = newvalue;
      this._userconfig.next(obj);
    }
  }

}
