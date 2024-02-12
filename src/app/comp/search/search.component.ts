import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig } from 'src/app/types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy, OnInit {

  busy: boolean = false;
  searchConfig?: SearchConfig;
  searchProgress: number = 0;
  searchProgressTitle: string = '';

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private searchService: SearchService,
    private router: Router) { }

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
    this.subs.push(this.searchService.searchConfig.subscribe((config) => this.searchConfig = config));
    this.subs.push(this.searchService.searchProgress.subscribe((value) => {
      this.searchProgress = value;
      if (this.searchProgress < 50)
        this.searchProgressTitle = 'waitingForResults';
      else if (this.searchProgress < 100)
        this.searchProgressTitle = 'queryingObjects';
      else
        this.searchProgressTitle = 'done';
    }));
    this.subs.push(this.searchService.searchBusy.subscribe((busy) => {
      if (!this.searchConfig)
        return;
      if (!busy && !this.busy)
        this.router.navigate(['/result'], { queryParams: { q: this.searchConfig.phrase, t: this.searchConfig.token } });
    }));
  }

}
