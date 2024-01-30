import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent implements OnInit {

  @Input({ required: true }) tree: SyshubConfigItem[] | SyshubPSetItem[] = [];
  @Input({ required: true }) treeUuids: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
  @Input({ required: true }) searchResult!: SearchResult;
  matchedNodeUuids: string[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,) { }

  getIcon(node: SyshubConfigItem | SyshubPSetItem): string {
    return this.cacheService.getIcon(node.type, node.value);
  }

  isOpen(node: SyshubConfigItem | SyshubPSetItem): boolean {
    if (this.treeUuids[node.uuid] == undefined || this.treeUuids[node.uuid][2] == undefined) {
      return false;
    }
    return this.treeUuids[node.uuid][2] || false;
  }

  ngOnInit(): void {
    this.searchResult.result?.config.forEach((item) => this.matchedNodeUuids.push(item.uuid));
  }

  toggleNode(node: SyshubConfigItem | SyshubPSetItem): void {
    if (this.treeUuids[node.uuid] == undefined || this.treeUuids[node.uuid][2] == undefined) {
      return;
    }
    this.treeUuids[node.uuid][2] = !this.treeUuids[node.uuid][2];
  }

}
