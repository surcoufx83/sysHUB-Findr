import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig } from 'src/app/types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() title: string = '';

  currentLocale: string;
  locales: string[] = environment.i10n?.locales ?? ['en', 'de'];
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

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
    this.searchService.searchBusy.subscribe((busy) => this.searchBusy = busy);
    this.locales.forEach((locale) => {
      this.localesLocalized[locale] = this.l10nphrase.common.locales[locale] ?? locale;
    });
    this.currentLocale = this.l10nService.lang.length > 2 ? this.l10nService.lang.substring(0, 2) : this.l10nService.lang;
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

  onSwitchLocale(locale: string): void {
    this.l10nService.switchTo(locale);
  }

  search() {
    if (this.searchConfig == undefined)
      return;
    if (this.phraseInput.trim().length < this.minPhraseLength) {
      //this.snackBar.open(this.i10n('search.errors.phraseEmpty', ['' + this.minPhraseLength]), this.i10n('common.phrases.okUc'));
      return;
    }
    let config = { ...this.searchConfig };
    config.phrase = this.phraseInput;
    this.searchService.search(config);
  }

}
