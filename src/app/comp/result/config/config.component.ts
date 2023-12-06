import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ResultConfigComponent implements OnInit, OnDestroy {

  @Input() searchPhrase!: string;
  @Input() searchResult!: SearchResult;
  @Input() configItems: { [key: string]: number } = {};
  @Input() configItemSorter: SyshubConfigItem[] = [];
  @Output() appcopy: EventEmitter<string> = new EventEmitter<string>();
  configTree: SyshubConfigItem[] = [];
  configItemsExpanded: string[] = [];
  activeNode: FlatConfigTreeNode | null = null;
  pinned: boolean = false;
  subscription?: Subscription;

  private _transformer = (node: SyshubConfigItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      hasMatch: (this.configItems[node.uuid] != undefined),
      childHasMatch: (this.configItemsExpanded.indexOf(node.uuid) != -1),
      obj: node,
      uuid: node.uuid,
      level: level,
    };
  };

  copyToClipboard(content: string): void {
    this.appcopy.emit(content);
  }

  treeControl = new FlatTreeControl<FlatConfigTreeNode>(
    node => node.level,
    node => node.expandable,
  );

  /* treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener); */

  constructor(private i10nService: L10nService,
    private cacheService: CacheService) {
    //this.dataSource.data = [];
  }

  getIcon(type: string, value: any = null, fallback: string = 'folder'): string {
    return this.cacheService.getIcon(type, value, fallback);
  }

  hasChild = (_: number, node: FlatConfigTreeNode) => node.expandable;

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  ngOnInit(): void {
    this.subscription = this.cacheService.config.subscribe((config) => {
      this.configItemsExpanded = [];
      this.configTree = config;
      config.forEach((configitem) => this.ngOnInitLoopItems(configitem));
      //this.dataSource.data = config;
      this.treeControl.dataNodes.forEach((node) => {
        if (this.configItemsExpanded.indexOf(node.uuid) != -1)
          this.treeControl.expand(node);
      });
    });
  }

  ngOnInitLoopItems(configitem: SyshubConfigItem): void {
    if (this.configItems[configitem.uuid] != undefined && this.configItemsExpanded.indexOf(configitem.uuid) == -1) {
      this.ngOnInitLoopItemsExpand(configitem);
    }
    configitem.children.forEach((childitem) => this.ngOnInitLoopItems(childitem));
  }

  ngOnInitLoopItemsExpand(configitem: SyshubConfigItem): void {
    this.configItemsExpanded.push(configitem.uuid);
    /* if (configitem.parentRef != undefined)
      this.ngOnInitLoopItemsExpand(configitem.parentRef); */
  }

}

interface FlatConfigTreeNode {
  expandable: boolean;
  hasMatch: boolean;
  childHasMatch: boolean;
  obj: SyshubConfigItem;
  uuid: string;
  level: number;
}
