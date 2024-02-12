import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult, SimpleKeyValue } from 'src/app/types';

@Component({
  selector: 'app-result-serverprops',
  templateUrl: './serverprops.component.html',
  styleUrl: './serverprops.component.scss'
})
export class ServerpropsComponent implements OnInit {

  serverProperties: SimpleKeyValue[] = [];
  @Input({ required: true }) searchResult!: SearchResult;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    let tempserverProperties: SimpleKeyValue[] = [];
    if (this.searchResult!.result?.system?.serverConfig === undefined || this.searchResult!.result?.system?.serverConfig === null || this.searchResult!.result?.system?.serverConfig === false)
      return;
    Object.entries(this.searchResult!.result.system.serverConfig.content).forEach((kvpair) => {
      tempserverProperties.push({ key: kvpair[0], value: this.ngOnInit_prepareServerConfig_convert(kvpair[1]) });
    });
    this.serverProperties = [...tempserverProperties].sort((a, b) => a.key.toLocaleLowerCase() > b.key.toLocaleLowerCase() ? 1 : a.key.toLocaleLowerCase() < b.key.toLocaleLowerCase() ? -1 : a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase() ? 1 : a.value.toLocaleLowerCase() < b.value.toLocaleLowerCase() ? -1 : 0);
  }

  ngOnInit_prepareServerConfig_convert(strin: any): any {
    if (!strin)
      return '';
    const teststr = `${strin}`.toLocaleLowerCase();
    if (teststr === 'true' || teststr === 'false')
      return teststr === 'true' ? true : false;
    if (!isNaN(Number(teststr)))
      return Number(teststr);
    return strin;
  }

}