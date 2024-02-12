import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { de, enUS, fr } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';
import { AppInitService } from './app-init.service';
import { L10nDe } from './i10n/de';
import { L10nEn } from './i10n/en';
import { L10nFr } from './i10n/fr';
import { L10nLocale } from './i10n/l10n-locale';

@Injectable({
  providedIn: 'root'
})
export class L10nService {

  private fallbackLocale: string;

  private userLocaleSub$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userLocaleSub = this.userLocaleSub$.asObservable();

  private browserLocale: string = '';
  private userLocale: string = '';
  private datefnsLocale = enUS;
  private locales: { [key: string]: L10nLocale } = {
    'en': L10nEn,
    'en-GB': L10nEn,
    'en-US': L10nEn,
    'de': L10nDe,
    'de-DE': L10nDe,
    'fr': L10nFr,
    'fr-FR': L10nFr,
  }

  constructor(
    appInitService: AppInitService,
  ) {
    this.fallbackLocale = appInitService.environment.i10n?.fallback ?? 'en';
    let olddata: string | null | L10nStorage = localStorage.getItem(appInitService.environment.storage?.l10nKey ?? 'kbL10n');
    if (olddata != null) {
      olddata = <L10nStorage>JSON.parse(olddata);
      this.userLocale = olddata.activeLocale;
    }
    for (let i = 0; i < navigator.languages.length; i++) {
      if (i == 0)
        this.browserLocale = navigator.languages[i];
      if (this.userLocale == '' && this.locales[navigator.languages[i]]) {
        this.userLocale = navigator.languages[i];
        break;
      }
    }
    if (this.userLocale == '')
      this.userLocale = this.fallbackLocale;
    this.userLocaleSub$.next(this.userLocale);
    this.userLocaleSub.subscribe((l) => {
      this.userLocale = l;
      switch (l) {
        case 'de':
        case 'de-DE':
        case '':
          this.datefnsLocale = de;
          break;
        case 'fr':
        case 'fr-FR':
          this.datefnsLocale = fr;
          break;
        default:
          this.datefnsLocale = enUS;
          break;
      }
      if (this.userLocale != '')
        localStorage.setItem(appInitService.environment.storage?.l10nKey ?? 'kbL10n', JSON.stringify(<L10nStorage>{
          activeLocale: this.userLocale,
          browserLocale: this.browserLocale,
        }));
    });
  }

  public get lang(): string {
    return this.userLocale;
  }

  public get locale(): L10nLocale {
    return this.locales[this.userLocale];
  }

  public cur(value: number, sign: string): string {
    return new Intl.NumberFormat(this.userLocale, { style: 'currency', currency: sign }).format(value);
  }

  public date(value: string | number | Date, form: string): string {
    if (typeof value === 'string')
      return format(parseISO(value), form, { locale: this.datefnsLocale });
    return format(value, form, { locale: this.datefnsLocale });
  }

  public getDateFnsLocale() {
    return this.datefnsLocale;
  }

  public dec(value: number, minFractionDigits: number = 0, maxFractionDigits: number | undefined = undefined): string {
    return value.toLocaleString(this.userLocale, { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits });
  }

  public ln(content: string, replacements: any[]): string {
    for (let i = 0; i < replacements.length; i++) {
      content = content.replace(`[${i}]`, replacements[i]);
    }
    return content;
  }

  public get supportedLocales(): string[] {
    return Object.keys(this.locales).filter((value) => value.length == 2);
  }

  public switchTo(locale: string) {
    if (locale != '' && this.locales[locale] && this.userLocaleSub$.value != locale) {
      this.userLocaleSub$.next(locale);
      location.reload();
    }
  }

}

export type L10nStorage = {
  activeLocale: string,
  browserLocale: string,
}