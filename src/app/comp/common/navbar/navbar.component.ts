import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { L10nService } from 'src/app/svc/i10n.service';
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

  minPhraseLength: number = environment.app?.minPhraseLength ?? 3;
  promolink: string = environment.app?.promotionLink ?? '';
  phraseInput: string = '';
  searchBusy: boolean = false;
  searchConfig?: SearchConfig;
  searchFocus: boolean = false;
  searchProgress: number = 100;

  constructor(
    private i10nService: L10nService,
    private searchService: SearchService,
    private router: Router
  ) { }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    this.searchService.searchBusy.subscribe((a) => this.searchBusy = a);
    this.searchService.searchConfig.subscribe((config) => {
      this.searchConfig = config;
      this.phraseInput = config.phrase;
    });
    this.searchService.searchProgress.subscribe((a) => this.searchProgress = a);
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
