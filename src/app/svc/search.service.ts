import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from 'syshub-rest-module';
import { SearchConfig, SearchResultUuids } from '../types';
import { CacheService } from './cache.service';

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
    private restapi: RestService,
    private router: Router) {
    let oldconfig = localStorage.getItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig');
    if (oldconfig != null) {
      let cfg: SearchConfig = <SearchConfig>JSON.parse(oldconfig);
      cfg.phrase = '';
      this._searchConfig.next({ ...cfg });
    }
    this.searchConfig.subscribe((config) => localStorage.setItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig', JSON.stringify(config)));
  }

  public search(search: SearchConfig): boolean {
    if (search.phrase == '' || search.phrase.trim().length < (environment.app?.minPhraseLength ?? 3) || this._searchBusy.value == true)
      return false;
    this._searchBusy.next(true);
    this._searchProgress.next(0);
    //search.token = this.cache.addSearch(search);
    this._searchConfig.next(search);
    this.router.navigate(['/search']);
    this.searchStep1(search);
    return true;
  }

  private searchStep1(search: SearchConfig): void {
    let component = this;
    this.restapi.post('workflows/execute/alias/findr-search', search).subscribe({
      next(value: any): void {
        component._searchProgress.next(50);
        component.searchStep2(search, <SearchResultUuids>value);
      },
      error(error: HttpErrorResponse): void {
        component._searchBusy.next(false);
        component._searchProgress.next(0);
        component.router.navigate(['/failure']);
      }
    });
  }

  private searchStep2(search: SearchConfig, result: SearchResultUuids): void {
    this.cache.setResult(search.token, result);
    this._searchBusy.next(false);
    this._searchProgress.next(100);
  }

}

let defaultSearchConfig: SearchConfig = {
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
