import { Point } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector',
  templateUrl: './node-inspector.component.html',
  styleUrl: './node-inspector.component.scss'
})
export class NodeInspectorComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input({ required: true }) searchResult!: SearchResult;

  private nodeTypes = ['ConfigItems', 'JobTypes', 'PSetItems', 'WorkflowItems', 'CertStoreItems', 'IppDevices', 'ServerConfig', 'ServerInformation', 'Users', 'ImpExpView'];
  private subs: Subscription[] = [];

  nodeCards: NodeInspectorItem[] = [];
  nodesAdded: string[] = [];
  zindex: number = 100;

  colorpalette = [
    '',
    'card-danger border-danger',
    'card-danger-subtle border-danger-subtle',
    'card-warning border-warning',
    'card-warning-subtle border-warning-subtle',
    'card-success border-success',
    'card-success-subtle border-success-subtle',
    'card-info border-info',
    'card-info-subtle border-info-subtle',
    'card-secondary border-secondary',
  ];


  @ViewChildren('nodeitem') nodeitems?: QueryList<ElementRef>;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngAfterViewInit(): void {
    console.log(this.nodeitems)
    this.subs.push(this.nodeitems!.changes.subscribe((nodes: ElementRef[]) => {
      console.log(nodes);
      nodes.forEach((node, i) => {
        console.log(node)
      })
      //nodes.
    }))
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.subs.push(this.propsService.NodeInspectorItem.subscribe((item) => {
      this.onInspectNewNodeItem(item.type, item.node, item.parentRect);
    }))
  }

  onInspectNewNodeItem(type: string, node: SyshubConfigItem | SyshubPSetItem, parentRect: DOMRect): void {
    if (!this.nodeTypes.includes(type))
      return;
    const nodeid = `node-${type}${node.uuid}`;
    if (this.nodesAdded.includes(nodeid)) {
      this.onReopenNode(nodeid);
      return;
    }
    console.log(node, parentRect, window.scrollY);
    console.log()
    this.nodesAdded.push(nodeid);

    this.nodeCards.push({
      id: nodeid,
      color: 0,
      nodeitem: node,
      type: type,
      zindex: ++this.zindex
    });
  }

  onReopenNode(nodeid: string) {
    this.nodeCards.forEach((node) => {
      if (node.id === nodeid)
        node.zindex = ++this.zindex;
    })
  }

  onRemoveNode(i: number, nodeid: string): void {
    for (let i = 0; i < this.nodesAdded.length; i++) {
      if (this.nodesAdded[i] === nodeid) {
        this.nodesAdded.splice(i, 1);
        this.nodeCards.forEach((node) => {
          if (node.id === nodeid)
            node.dispose = true;
        });
        return;
      }
    }
  }

}

export type NodeInspectorItem = {
  id: string;
  color: number;
  dispose?: boolean;
  nodeitem: SyshubConfigItem | SyshubPSetItem;
  type: string;
  zindex: number;
}
