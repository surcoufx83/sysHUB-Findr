import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService, defaultSearchConfig } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchConfig } from 'src/app/types';
import { RestService, SyshubCategory } from 'syshub-rest-module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, OnInit {

  currentLocale: string;
  disabledFunctions: ('config' | 'jobtypes' | 'parameterset' | 'workflows' | 'certstore' | 'serverConfig' | 'serverInfo' | 'ippDevices' | 'users')[] = [];
  enableCache: boolean = true;
  loggedin: boolean = false;
  minPhraseLength: number = 3;
  phraseInput: string = '';
  searchBusy: boolean = false;
  searchConfig?: SearchConfig;
  showMoreFilter: boolean = false;
  username: string = '';

  categories: SyshubCategory[] = [];
  subs: Subscription[] = [];

  searchForm = new FormGroup({
    phrase: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(this.minPhraseLength)] }),
    searchConfig: new FormControl<boolean>(true),
    searchJobtypes: new FormControl<boolean>(true),
    searchPSet: new FormControl<boolean>(true),
    searchWorkflows: new FormControl<boolean>(true),
    categoryFilter: new FormControl<string | null>(null),
    excludeBComments: new FormControl<boolean>(true),
    includeUuids: new FormControl<boolean>(true),
    searchWorkflowContent: new FormControl<boolean>(true),
    searchCertstore: new FormControl<boolean>(false),
    searchServerConfig: new FormControl<boolean>(false),
    searchServerInfo: new FormControl<boolean>(false),
    searchIppDevices: new FormControl<boolean>(false),
    searchUsers: new FormControl<boolean>(false),
  });

  constructor(
    appInitService: AppInitService,
    private l10nService: L10nService,
    private restapi: RestService,
    private searchService: SearchService,
    private cacheService: CacheService,
    private toastsService: ToastsService,
  ) {
    this.currentLocale = l10nService.lang.length > 2 ? l10nService.lang.substring(0, 2) : l10nService.lang;
    this.disabledFunctions = appInitService.environment.app?.disabledFunctions ?? [];
    this.enableCache = appInitService.environment.app?.useCache ?? true;
    this.minPhraseLength = appInitService.environment.app?.minPhraseLength ?? 3;
  }

  changeCacheCheckbox(): void {
    this.cacheService.useCache(this.enableCache);
  }

  changeFilterView(): void {
    this.cacheService.showMoreFilter(!this.showMoreFilter);
  }

  get isDefaultConfig(): boolean {
    return (this.searchForm.controls.searchConfig.value || true) == defaultSearchConfig.topics.config &&
      (this.searchForm.controls.searchJobtypes.value || true) == defaultSearchConfig.topics.jobtypes &&
      (this.searchForm.controls.searchPSet.value || true) == defaultSearchConfig.topics.parameterset &&
      (this.searchForm.controls.searchWorkflows.value || true) == defaultSearchConfig.topics.workflows &&
      (this.searchForm.controls.searchCertstore.value || false) == defaultSearchConfig.topics.system.certstore &&
      (this.searchForm.controls.searchServerConfig.value || false) == defaultSearchConfig.topics.system.serverConfig &&
      (this.searchForm.controls.searchServerInfo.value || false) == defaultSearchConfig.topics.system.serverInfo &&
      (this.searchForm.controls.searchIppDevices.value || false) == defaultSearchConfig.topics.system.ippDevices &&
      (this.searchForm.controls.searchUsers.value || false) == defaultSearchConfig.topics.system.users
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

  ngOnInit(): void {
    this.subs.push(this.restapi.getCurrentUser().subscribe((reply) => this.username = reply instanceof Error ? '' : reply.name));
    this.subs.push(this.restapi.isLoggedIn.subscribe((v) => this.loggedin = v));
    this.subs.push(this.cacheService.Categories.subscribe((categories) => this.categories = categories));
    this.subs.push(this.cacheService.userconfig.subscribe((uc) => {
      this.enableCache = uc.enableCache;
      this.showMoreFilter = uc.showMoreFilter || false;
    }));
    this.subs.push(this.searchService.searchBusy.subscribe((busy) => this.searchBusy = busy));
    this.subs.push(this.searchService.searchConfig.subscribe((cfg) => {
      this.searchConfig = { ...cfg };
      this.searchForm.controls.phrase.patchValue(cfg.phrase);
      this.searchForm.controls.searchConfig.patchValue(cfg.topics.config);
      this.searchForm.controls.searchJobtypes.patchValue(cfg.topics.jobtypes);
      this.searchForm.controls.searchPSet.patchValue(cfg.topics.parameterset);
      this.searchForm.controls.searchWorkflows.patchValue(cfg.topics.workflows);
      this.searchForm.controls.searchCertstore.patchValue(cfg.topics.system.certstore);
      this.searchForm.controls.searchServerConfig.patchValue(cfg.topics.system.serverConfig);
      this.searchForm.controls.searchServerInfo.patchValue(cfg.topics.system.serverInfo);
      this.searchForm.controls.searchIppDevices.patchValue(cfg.topics.system.ippDevices);
      this.searchForm.controls.searchUsers.patchValue(cfg.topics.system.users);
      this.searchForm.controls.categoryFilter.patchValue(cfg.filter.categoryFilter == null ? null : cfg.filter.categoryFilter.uuid);
      this.searchForm.controls.excludeBComments.patchValue(cfg.filter.excludeBComments);
      this.searchForm.controls.includeUuids.patchValue(cfg.filter.includeUuids);
      this.searchForm.controls.searchWorkflowContent.patchValue(cfg.filter.searchWorkflowContent);
      this.searchForm.markAsPristine();
    }));
  }

  onSubmitSearch() {
    if (this.searchBusy)
      return;
    if (this.searchForm.invalid) {
      this.toastsService.addDangerToast({
        message: this.l10n(this.l10nphrase.search.errors.phraseEmpty, [this.minPhraseLength]),
      });
      return;
    }
    let newcfg: SearchConfig = { ...this.searchConfig || { ...defaultSearchConfig } }
    newcfg.phrase = this.searchForm.controls.phrase.value!;
    newcfg.topics.config = this.searchForm.controls.searchConfig.value!;
    newcfg.topics.jobtypes = this.searchForm.controls.searchJobtypes.value!;
    newcfg.topics.parameterset = this.searchForm.controls.searchPSet.value!;
    newcfg.topics.workflows = this.searchForm.controls.searchWorkflows.value!;
    newcfg.topics.system.certstore = this.searchForm.controls.searchCertstore.value!;
    newcfg.topics.system.serverConfig = this.searchForm.controls.searchServerConfig.value!;
    newcfg.topics.system.serverInfo = this.searchForm.controls.searchServerInfo.value!;
    newcfg.topics.system.ippDevices = this.searchForm.controls.searchIppDevices.value!;
    newcfg.topics.system.users = this.searchForm.controls.searchUsers.value!;
    newcfg.filter.categoryFilter = this.searchForm.controls.categoryFilter.value != null ? this.cacheService.getCatgeory(this.searchForm.controls.categoryFilter.value) : null;
    newcfg.filter.excludeBComments = this.searchForm.controls.excludeBComments.value!;
    newcfg.filter.includeUuids = this.searchForm.controls.includeUuids.value!;
    newcfg.filter.searchWorkflowContent = this.searchForm.controls.searchWorkflowContent.value!;
    this.searchService.search(newcfg);
  }

  syncCategories(): void {
    this.cacheService.reloadCategories();
  }

}
