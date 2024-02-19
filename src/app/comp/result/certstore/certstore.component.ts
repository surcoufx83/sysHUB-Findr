import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResultCertStoreContent, SearchResult } from 'src/app/types';
import { SyshubCertStoreItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-certstore',
  templateUrl: './certstore.component.html',
  styleUrl: './certstore.component.scss'
})
export class CertstoreComponent implements OnInit {

  certstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };
  itemsMatched: { keystore: string[], truststore: string[] } = { keystore: [], truststore: [] };
  nodesToggled: string[] = [];
  @Input({ required: true }) searchResult!: SearchResult;
  @Input({ required: true }) showUnmatchedItems!: boolean;

  constructor(private l10nService: L10nService,
    private searchService: SearchService,
    private propsService: PagepropsService,) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    if (this.searchResult!.result?.system?.certstore === undefined || this.searchResult!.result?.system?.certstore === null || this.searchResult!.result?.system?.certstore === false)
      return;
    this.certstore.keystore = [...this.searchResult.result.system.certstore.content.keystore];
    this.certstore.keystore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult.search))
        this.itemsMatched.keystore.push(cert.certX509SubjectDN);
    });
    this.certstore.truststore = [...this.searchResult.result.system.certstore.content.truststore];
    this.certstore.truststore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult.search))
        this.itemsMatched.truststore.push(cert.certX509SubjectDN);
    });
  }

  hoverNode(node: SyshubCertStoreItem, event: MouseEvent): void {
    this.propsService.inspect('CertStoreItems', node, 'show', {
      top: event.pageY - 74,
      left: event.pageX + 86,
    });
  }

  leaveNode(node: SyshubCertStoreItem): void {
    if (!this.nodesToggled.includes(node.certX509SubjectDN))
      this.propsService.inspect('CertStoreItems', node, 'remove');
  }

  selectNode(node: SyshubCertStoreItem): void {
    if (!this.nodesToggled.includes(node.certX509SubjectDN))
      this.nodesToggled.push(node.certX509SubjectDN);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.certX509SubjectDN, 1));
  }

}