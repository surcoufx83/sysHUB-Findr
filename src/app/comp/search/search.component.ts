import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig } from 'src/app/types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  busy: boolean = false;
  searchConfig?: SearchConfig;
  searchProgress: number = 0;
  searchProgressTitle: string = '';

  constructor(private i10nService: L10nService,
    private searchService: SearchService,
    private router: Router) { }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    this.searchService.searchConfig.subscribe((config) => this.searchConfig = config);
    this.searchService.searchProgress.subscribe((value) => {
      this.searchProgress = value;
      if (this.searchProgress < 50)
        this.searchProgressTitle = 'waitingForResults';
      else if (this.searchProgress < 100)
        this.searchProgressTitle = 'queryingObjects';
      else
        this.searchProgressTitle = 'done';
    });
    this.searchService.searchBusy.subscribe((busy) => {
      if (!this.searchConfig)
        return;
      if (!busy && !this.busy)
        this.router.navigate(['/result']);
    });
  }

}
