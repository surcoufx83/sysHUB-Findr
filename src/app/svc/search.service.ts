import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response, RestService } from 'syshub-rest-module';
import { SearchConfig, SearchResultUuids } from '../types';
import { CacheService } from './cache.service';
import { ToastsService } from './toasts.service';
import { L10nService } from './i10n.service';
import { L10nLocale } from './i10n/l10n-locale';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _searchBusy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public searchBusy = this._searchBusy.asObservable();
  private _searchConfig: BehaviorSubject<SearchConfig> = new BehaviorSubject<SearchConfig>(defaultSearchConfig);
  public searchConfig = this._searchConfig.asObservable();
  private _searchProgress: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  public searchProgress = this._searchProgress.asObservable();

  constructor(
    private cache: CacheService,
    private l10nService: L10nService,
    private restapi: RestService,
    private toastsService: ToastsService,
    private router: Router) {
    let oldconfig = localStorage.getItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig');
    if (oldconfig != null) {
      let cfg: SearchConfig = <SearchConfig>JSON.parse(oldconfig);
      cfg.phrase = '';
      this._searchConfig.next({ ...cfg });
    }
    this.searchConfig.subscribe((config) => localStorage.setItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig', JSON.stringify(config)));
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  public search(search: SearchConfig): boolean {
    if (search.phrase == '' || search.phrase.trim().length < (environment.app?.minPhraseLength ?? 3) || this._searchBusy.value == true)
      return false;
    this._searchBusy.next(true);
    this._searchProgress.next(0);
    search.token = this.cache.prepareSearch(search);
    this._searchConfig.next(search);
    this.router.navigate(['/search']);
    this.searchStep1(search);
    return true;
  }

  private searchStep1(search: SearchConfig): void {
    let component = this;
    this.restapi.runWorkflowAlias('findr-search', search).subscribe((reply: Response) => {
      console.log(reply);
      if (reply.status == HttpStatusCode.Ok) {
        component._searchProgress.next(20);
        component.searchStep2(search, <SearchResultUuids>reply.content);
      }
      else {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.content['message'] ?? 'Unknown error, see browser console']),
        });
        this._searchBusy.next(false);
        this._searchProgress.next(100);
      }
    });
  }

  private searchStep2(search: SearchConfig, result: SearchResultUuids): void {
    this.cache.setResult(search.token, result);
    this._searchBusy.next(false);
    this._searchProgress.next(100);
  }

}

export const defaultSearchConfig: SearchConfig = {
  phrase: '',
  token: '',
  topics: {
    config: true,
    jobtypes: true,
    parameterset: true,
    workflows: true,
  },
  filter: {
    categoryFilter: null,
    excludeBComments: true,
    includeUuids: false,
    searchWorkflowContent: true,
  },
  options: {
    enableCache: true,
  }
}
