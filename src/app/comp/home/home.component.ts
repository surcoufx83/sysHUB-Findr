import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig } from 'src/app/types';
import { environment } from 'src/environments/environment';
import { RestService, SyshubCategory } from 'syshub-rest-module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  enableCache: boolean = environment.app?.useCache ?? true;
  loggedin: boolean = false;
  minPhraseLength: number = environment.app?.minPhraseLength ?? 3;
  phraseInput: string = '';
  searchConfig?: SearchConfig;
  username: string = '';

  categories: SyshubCategory[] = [];

  constructor(
    private i10nService: L10nService,
    private restapi: RestService,
    //private snackBar: MatSnackBar,
    private searchService: SearchService,
    private cacheService: CacheService
  ) { }

  changeCacheCheckbox(): void {
    this.cacheService.useCache(this.enableCache);
  }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    this.restapi.getCurrentUser().subscribe((reply) => { console.log(reply); this.username = reply.name });
    this.restapi.isLoggedIn.subscribe((v) => this.loggedin = v);
    this.cacheService.Categories.subscribe((categories) => this.categories = categories);
    this.searchService.searchConfig.subscribe((config) => this.searchConfig = config);
    this.cacheService.userconfig.subscribe((uc) => this.enableCache = uc.enableCache);
  }

  search(): void {
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

  syncCategories(): void {
    this.cacheService.reloadCategories();
  }

}
