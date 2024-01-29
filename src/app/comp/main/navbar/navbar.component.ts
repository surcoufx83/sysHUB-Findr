import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService, defaultSearchConfig } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchConfig } from 'src/app/types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() title: string = '';

  appTheme: 'light' | 'dark' | 'auto' | null = null;
  currentLocale: string;
  locales: string[] = environment.i10n?.locales ?? ['en', 'de', 'fr'];
  localesLocalized: { [key: string]: string } = {};
  minPhraseLength: number = environment.app?.minPhraseLength ?? 3;
  promolink: string = environment.app?.promotionLink ?? '';
  webclientlink: string = environment.app?.webclientLink ?? '';
  phraseInput: string = '';
  searchBusy: boolean = false;
  searchConfig?: SearchConfig;
  searchFocus: boolean = false;
  searchProgress: number = 100;
  url = '/';

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
    private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private toastsService: ToastsService,
    private pagepropsService: PagepropsService,
    router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
    this.searchService.searchBusy.subscribe((busy) => this.searchBusy = busy);
    this.searchService.searchConfig.subscribe((cfg) => {
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
    });
    this.locales.forEach((locale) => {
      this.localesLocalized[locale] = this.l10nphrase.common.locales[locale] ?? locale;
    });
    this.currentLocale = this.l10nService.lang.length > 2 ? this.l10nService.lang.substring(0, 2) : this.l10nService.lang;
    this.pagepropsService.AppTheme.subscribe((theme) => this.appTheme = theme);
  }

  applyTheme(theme: 'light' | 'dark' | null): void {
    this.pagepropsService.applyTheme(theme);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    this.searchService.searchBusy.subscribe((a) => this.searchBusy = a);
    this.searchService.searchConfig.subscribe((config) => {
      this.searchConfig = config;
      this.phraseInput = config.phrase;
    });
    this.searchService.searchProgress.subscribe((a) => this.searchProgress = a);
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
