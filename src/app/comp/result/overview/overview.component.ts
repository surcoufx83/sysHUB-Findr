import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig, SearchResult, SearchResultCertStoreContent, SimpleKeyValue } from 'src/app/types';
import { SyshubCertStoreItem, SyshubConfigItem, SyshubIppDevice, SyshubJobType, SyshubPSetItem, SyshubUserAccount, SyshubWorkflow } from 'syshub-rest-module';
import titleize from 'titleize';

@Component({
  selector: 'app-result-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  @Input({ required: true }) searchResult!: SearchResult;
  @Input({ required: true }) totalMatchCount: number = 0;

  @Input({ required: true }) certstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };
  @Input({ required: true }) configByTree: { [key: string]: SyshubConfigItem[] } = {};
  @Input({ required: true }) configTreeKeys: string[] = [];
  @Input({ required: true }) ippDevices: SyshubIppDevice[] = [];
  @Input({ required: true }) jobtypes: SyshubJobType[] = [];
  @Input({ required: true }) psetByTree: { [key: string]: SyshubPSetItem[] } = {};
  @Input({ required: true }) psetTreeKeys: string[] = [];
  @Input({ required: true }) serverInfo: SimpleKeyValue[] = [];
  @Input({ required: true }) serverProperties: SimpleKeyValue[] = [];
  @Input({ required: true }) user: SyshubUserAccount[] = [];
  @Input({ required: true }) workflows: SyshubWorkflow[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  fixcase(strin: string): string {
    return titleize(strin);
  }

}
