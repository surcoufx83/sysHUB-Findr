import { Point } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SyshubConfigItem, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector',
  templateUrl: './node-inspector.component.html',
  styleUrl: './node-inspector.component.scss'
})
export class NodeInspectorComponent implements AfterViewInit, OnDestroy, OnInit {

  private nodeTypes = ['ConfigItems', 'JobTypes', 'PSetItems', 'WorkflowItems', 'CertStoreItems', 'IppDevices', 'ServerConfig', 'ServerInformation', 'Users', 'ImpExpView'];
  private subs: Subscription[] = [];

  nodeCards: NodeInspectorItem[] = [];
  nodesAdded: string[] = [];
  zindex: number = 1200;

  @ViewChildren('nodeitem') nodeitems?: QueryList<ElementRef>;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
    @Inject(DOCUMENT) private document: Document
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
    this.onDisposeNode(nodeid);
    console.log(node, parentRect, window.scrollY);
    console.log()
    this.nodesAdded.push(nodeid);

    this.nodeCards.push({
      id: nodeid,
      dragroot: `#drag-root-${node.uuid}`,
      position: {
        x: parentRect.right + 24,
        y: parentRect.top
      },
      zindex: ++this.zindex
    });
  }

  disposeNodes: any;
  onDisposeNode(id: string): void {
    if (!this.nodesAdded.includes(id))
      return;
    this.nodeCards.forEach((node, i) => {
      if (node.id === id)
        node.dispose = true;
      clearTimeout(this.disposeNodes);
      this.disposeNodes = setTimeout(() => {
        this.onDisposeNodes();
      }, 10000);
    })
    this.nodesAdded.splice(this.nodesAdded.indexOf(id), 1);
  }

  onDisposeNodes(): void {
    console.log('onDisposeNodes')
    for (let i = this.nodeCards.length - 1; i >= 0; i--) {
      console.log('onDisposeNodes', i, this.nodeCards[i].dispose)
      if (this.nodeCards[i].dispose === true) {
        console.warn('onDisposeNodes DELETE ', this.nodeCards[i])
        this.nodeCards.splice(i, 1);
      }
    }
  }

}

export type NodeInspectorItem = {
  id: string;
  dispose?: boolean;
  dragroot: string
  position: Point;
  ref?: ElementRef;
  zindex: number;
}
