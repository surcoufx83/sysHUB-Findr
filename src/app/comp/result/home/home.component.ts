import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchResult } from 'src/app/types';

@Component({
  selector: 'app-result-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ResultHomeComponent implements OnInit {

  @Input() searchPhrase!: string;
  @Input() searchResult!: SearchResult;
  /* @Input() configItemSorter: SyshubConfig[] = [];
  @Input() jobtypeItemSorter: SyshubJobtype[] = [];
  @Input() jobtypeAttributesMatched: { [key: string]: SyshubNameValueItem[] } = {};
  @Input() jobtypeCustomAttributesMatched: { [key: string]: SyshubNameValueItem[] } = {};
  @Input() parametersetItemSorter: SyshubParameterset[] = [];
  @Input() workflowItemSorter: SyshubWorkflow[] = []; */

  constructor(private i10nService: L10nService,
    private cacheService: CacheService) { }

  getIcon(type: string, value: any = null, fallback: string = 'folder'): string {
    return this.cacheService.getIcon(type, value, fallback);
  }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnInit(): void { }

}
