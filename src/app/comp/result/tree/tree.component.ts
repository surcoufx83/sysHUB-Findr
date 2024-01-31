import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent implements OnInit {

  @Input({ required: true }) treetype!: 'ConfigItems' | 'PSetItems';
  @Input({ required: true }) tree: SyshubConfigItem[] | SyshubPSetItem[] = [];
  @Input({ required: true }) treeUuids: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
  @Input({ required: true }) searchResult!: SearchResult;
  matchedNodeUuids: string[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  getIcon(node: SyshubConfigItem | SyshubPSetItem): string {
    return this.cacheService.getIcon(node.type, node.value);
  }

  isOpen(node: SyshubConfigItem | SyshubPSetItem): boolean {
    if (this.treeUuids[node.uuid] == undefined || this.treeUuids[node.uuid][2] == undefined) {
      return false;
    }
    return this.treeUuids[node.uuid][2] || false;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    if (this.treetype === 'ConfigItems')
      this.searchResult.result?.config.forEach((item) => this.matchedNodeUuids.push(item.uuid));
    else if (this.treetype === 'PSetItems')
      this.searchResult.result?.parameterset.forEach((item) => this.matchedNodeUuids.push(item.uuid));
  }

  selectNode(node: SyshubConfigItem | SyshubPSetItem): void {
    this.propsService.inspect(this.treetype, node);
  }

  toggleNode(node: SyshubConfigItem | SyshubPSetItem): void {
    if (this.treeUuids[node.uuid] == undefined || this.treeUuids[node.uuid][2] == undefined) {
      return;
    }
    this.treeUuids[node.uuid][2] = !this.treeUuids[node.uuid][2];
  }

}
