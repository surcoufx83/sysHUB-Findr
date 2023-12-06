import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
//import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchResult } from 'src/app/types';
import { SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-parameterset',
  templateUrl: './parameterset.component.html',
  styleUrls: ['./parameterset.component.scss']
})
export class ResultParametersetComponent implements OnInit, OnDestroy {

  @Input() searchPhrase!: string;
  @Input() searchResult!: SearchResult;
  @Input() parametersetItems: { [key: string]: number } = {};
  @Input() parametersetItemSorter: SyshubPSetItem[] = [];
  @Output() appcopy: EventEmitter<string> = new EventEmitter<string>();
  parametersetTree: SyshubPSetItem[] = [];
  parametersetItemsExpanded: string[] = [];
  activeNode: FlatparametersetTreeNode | null = null;
  pinned: boolean = false;
  subscription?: Subscription;

  private _transformer = (node: SyshubPSetItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      hasMatch: (this.parametersetItems[node.uuid] != undefined),
      childHasMatch: (this.parametersetItemsExpanded.indexOf(node.uuid) != -1),
      obj: node,
      uuid: node.uuid,
      level: level,
    };
  };

  copyToClipboard(content: string): void {
    this.appcopy.emit(content);
  }

  treeControl = new FlatTreeControl<FlatparametersetTreeNode>(
    node => node.level,
    node => node.expandable,
  );

  /* treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  ); */

  //dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private i10nService: L10nService,
    private cacheService: CacheService) {
    //this.dataSource.data = [];
  }

  getIcon(type: string, value: any = null, fallback: string = 'folder'): string {
    return this.cacheService.getIcon(type, value, fallback);
  }

  hasChild = (_: number, node: FlatparametersetTreeNode) => node.expandable;

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
    this.subscription = this.cacheService.parameterset.subscribe((parameterset) => {
      this.parametersetItemsExpanded = [];
      this.parametersetTree = parameterset;
      parameterset.forEach((parametersetitem) => this.ngOnInitLoopItems(parametersetitem));
      //this.dataSource.data = parameterset;
      this.treeControl.dataNodes.forEach((node) => {
        if (this.parametersetItemsExpanded.indexOf(node.uuid) != -1)
          this.treeControl.expand(node);
      });
    });
  }

  ngOnInitLoopItems(parametersetitem: SyshubPSetItem): void {
    if (this.parametersetItems[parametersetitem.uuid] != undefined && this.parametersetItemsExpanded.indexOf(parametersetitem.uuid) == -1) {
      this.ngOnInitLoopItemsExpand(parametersetitem);
    }
    parametersetitem.children.forEach((childitem) => this.ngOnInitLoopItems(childitem));
  }

  ngOnInitLoopItemsExpand(parametersetitem: SyshubPSetItem): void {
    this.parametersetItemsExpanded.push(parametersetitem.uuid);
    /* if (parametersetitem.parentRef != undefined)
      this.ngOnInitLoopItemsExpand(parametersetitem.parentRef); */
  }

}

interface FlatparametersetTreeNode {
  expandable: boolean;
  hasMatch: boolean;
  childHasMatch: boolean;
  obj: SyshubPSetItem;
  uuid: string;
  level: number;
}
