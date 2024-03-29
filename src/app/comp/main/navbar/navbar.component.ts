import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { fromUnixTime, isToday } from 'date-fns';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService, defaultSearchConfig } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchConfig, SearchResult } from 'src/app/types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy, OnInit {

  @Input() title: string = '';

  appTheme: 'light' | 'dark' | 'auto' | null = null;
  busyReloadingEntities?: Observable<string[]>;
  currentLocale: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  disabledFunctions: ('config' | 'jobtypes' | 'parameterset' | 'workflows' | 'certstore' | 'serverConfig' | 'serverInfo' | 'ippDevices' | 'users')[] = [];
  locales: string[];
  localesLocalized: { [key: string]: string } = {};
  minPhraseLength: number = 3;
  phraseInput: string = '';
  promolink: string;
  searchBusy: boolean = false;
  searchConfig?: SearchConfig;
  searchFocus: boolean = false;
  searchHistory?: Observable<{ [key: string]: [string, SearchResult] }>;
  searchProgress: number = 100;
  subs: Subscription[] = [];
  url = '/';
  webclientlink: string;

  searchForm = new FormGroup({
    phrase: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(this.minPhraseLength)] }),
    searchConfig: new FormControl<boolean>(true),
    searchJobtypes: new FormControl<boolean>(true),
    searchPSet: new FormControl<boolean>(true),
    searchWorkflows: new FormControl<boolean>(true),
    searchCertstore: new FormControl<boolean>(false),
    searchServerConfig: new FormControl<boolean>(false),
    searchServerInfo: new FormControl<boolean>(false),
    searchIppDevices: new FormControl<boolean>(false),
    searchUsers: new FormControl<boolean>(false),
  });

  constructor(
    appInitService: AppInitService,
    private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private toastsService: ToastsService,
    private pagepropsService: PagepropsService,
    private router: Router
  ) {
    this.deviceType = pagepropsService.DeviceType;
    this.disabledFunctions = appInitService.environment.app?.disabledFunctions ?? [];
    this.locales = appInitService.environment.i10n?.locales ?? ['en', 'de', 'fr'];
    this.minPhraseLength = appInitService.environment.app?.minPhraseLength ?? 3;
    this.promolink = appInitService.environment.app?.promotionLink ?? '';
    this.webclientlink = appInitService.environment.app?.webclientLink ?? '';
    this.locales.forEach((locale) => {
      this.localesLocalized[locale] = this.l10nphrase.common.locales[locale] ?? locale;
    });
    this.currentLocale = this.l10nService.lang.length > 2 ? this.l10nService.lang.substring(0, 2) : this.l10nService.lang;
  }

  applyTheme(theme: 'light' | 'dark' | null): void {
    this.pagepropsService.applyTheme(theme);
  }

  public date(timestamp: string, form: string): string {
    return this.l10nService.date(fromUnixTime(+timestamp * 1000), form);
  }

  getFormat(timestamp: string): string {
    return isToday(fromUnixTime(+timestamp * 1000)) ? 'p' : 'Pp';
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
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
      this.searchForm.markAsPristine();
    }));
    this.subs.push(this.searchService.searchProgress.subscribe((a) => this.searchProgress = a));
    this.subs.push(this.pagepropsService.AppTheme.subscribe((theme) => this.appTheme = theme));
    this.busyReloadingEntities = this.cacheService.RefreshingEntities;
    this.searchHistory = this.cacheService.SearchHistory;
  }

  onClearCache(): void {
    this.cacheService.clear();
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
    this.searchService.search(newcfg);
  }

  onSwitchLocale(locale: string): void {
    this.l10nService.switchTo(locale);
  }

}
