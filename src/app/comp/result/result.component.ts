import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnDestroy, OnInit {

  selectedChapter: '' | 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems' = '';
  searchResult: SearchResult | null = null;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private router: Router,
    private route: ActivatedRoute) { }

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
    this.subs.push(this.cacheService.searchresult.subscribe((result) => {
      console.log('ResultComponent.ngOnInit().searchresult()', result)
      this.searchResult = result;
    }));
    this.route.queryParamMap.subscribe((map) => {
      console.log('ResultComponent.ngOnInit()', map)
      if (map.has('t')) {
        if (!this.cacheService.loadSearchResult(map.get('t')!))
          this.router.navigate(['/']);
      } else
        this.router.navigate(['/']);
      let view = map.get('view') ?? '';
      if (view == '' || view == 'ConfigItems' || view == 'JobTypes' || view == 'PSetItems' || view == 'WorkflowItems')
        this.selectedChapter = view;
    })
  }

}
