import { Component, Inject, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
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

  selectedChapter: '' | 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems' | 'CertStoreItems' | 'IppDevices' | 'ServerConfig' | 'ServerInformation' | 'Users' | 'ImpExpView' = '';
  searchResult: SearchResult | null = null;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  getMatches(obj: { matches: number, content: any } | null | false | undefined): number {
    if (obj === null || obj === undefined || obj === false)
      return 0;
    return obj.matches;
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
      if (view == '' || view == 'ConfigItems' || view == 'JobTypes' || view == 'PSetItems' || view == 'WorkflowItems' || view == 'CertStoreItems' || view == 'IppDevices' || view == 'ServerConfig' || view == 'ServerInformation' || view == 'Users')
        this.selectedChapter = view;
    })
  }

  onExportResultBtnClick(): void {
    if (!this.searchResult)
      return;
    const data = JSON.stringify(this.searchResult, null, 2);
    const blobdata = new Blob([data], {
      type: 'application/json'
    });
    let link = this.document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = URL.createObjectURL(blobdata);
    link.download = `Findr search for ${encodeURI(this.searchResult.search.phrase)}.json`;
    this.document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
