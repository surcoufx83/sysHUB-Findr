import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { NodeInspectorRequest, PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult } from 'src/app/types';
import { SyshubCertStoreItem, SyshubConfigItem, SyshubIppDevice, SyshubJobType, SyshubPSetItem, SyshubUserAccount, SyshubWorkflow } from 'syshub-rest-module';
import { SvgElement } from '../workflow-ui/canvas/element';
import { DOCUMENT } from '@angular/common';
import { CacheService } from 'src/app/svc/cache.service';

@Component({
  selector: 'app-node-inspector',
  templateUrl: './node-inspector.component.html',
  styleUrl: './node-inspector.component.scss'
})
export class NodeInspectorComponent implements OnDestroy, OnInit {

  @Input({ required: true }) searchResult?: SearchResult;

  private nodeTypes = ['ConfigItems', 'JobTypes', 'PSetItems', 'WorkflowItems', 'CertStoreItems', 'IppDevices', 'ServerConfig', 'ServerInformation', 'Users', 'ImpExpView', 'SvgNode'];
  private subs: Subscription[] = [];

  nodeCards: NodeInspectorItem[] = [];
  nodesAdded: string[] = [];
  showPsetTreeInProcessNodes: boolean = true;
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

  constructor(private l10nService: L10nService,
    private propsService: PagepropsService,
    private cacheService: CacheService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.subs.push(this.propsService.NodeInspectorItem.subscribe((request) => this.onInspectNewNodeItem(request)));
    this.subs.push(this.cacheService.userconfig.subscribe((cfg) => this.showPsetTreeInProcessNodes = cfg.showPsetTreeInProcessNodes ?? true));
  }

  onInspectNewNodeItem(request: NodeInspectorRequest): void {
    if (!this.nodeTypes.includes(request.type))
      return;
    const nodeid =
      request.type === 'IppDevices' ?
        `node-${request.type}${encodeURIComponent((<SyshubIppDevice>request.node).name)}` :
        request.type === 'CertStoreItems' ?
          `node-${request.type}${encodeURIComponent((<SyshubCertStoreItem>request.node).alias)}` :
          `node-${request.type}${(<SvgElement | SyshubConfigItem | SyshubPSetItem | SyshubJobType | SyshubUserAccount | SyshubWorkflow>request.node).uuid}`;

    request.id = nodeid;

    if (request.action == 'remove') {
      for (let i = 0; i < this.nodesAdded.length; i++) {
        if (this.nodesAdded[i] === nodeid) {
          this.onRemoveNode(i, nodeid);
          return;
        }
      }
      return;
    }

    if (this.nodesAdded.includes(nodeid)) {
      this.onReopenNode(nodeid);
      return;
    }
    this.nodesAdded.push(nodeid);

    let initialPosition = 0;
    this.nodeCards.forEach((card) => {
      if (!card.moved && !card.dispose)
        initialPosition++;
    });

    this.nodeCards.push({
      id: nodeid,
      color: 0,
      display: 'none',
      dispose: false,
      location: initialPosition,
      moved: (request.placeAt != undefined),
      nodeitem: request.node,
      request: { ...request },
      type: request.type,
      zindex: ++this.zindex
    });

    setTimeout(() => {
      let element = this.document.getElementById(nodeid);
      if (!element)
        return;
      if (request.placeAt != undefined) {
        if (request.placeAt!.top)
          element.style.top = `${request.placeAt!.top}px`;
        if (request.placeAt!.left)
          element.style.left = `${request.placeAt!.left}px`;
        if (request.placeAt!.right)
          element.style.right = `${request.placeAt!.right}px`;
      } else {
        element.style.left = `${initialPosition * 15}px`;
        element.style.top = `${initialPosition * 50}px`;
      }
      element.style.display = 'flex';
    }, 10);

    setTimeout(() => {
      this.propsService.NodesOpened.next(request);
    }, 2);

  }

  onReopenNode(nodeid: string) {
    this.nodeCards.forEach((node) => {
      if (node.id === nodeid)
        node.zindex = ++this.zindex;
    })
  }

  onRemoveNode(i: number, nodeid: string, manual?: boolean): void {
    for (let i = 0; i < this.nodesAdded.length; i++) {
      if (this.nodesAdded[i] === nodeid) {
        this.nodesAdded.splice(i, 1);
        for (let i = 0; i < this.nodeCards.length; i++) {
          if (nodeid !== this.nodeCards[i].id || this.nodeCards[i].dispose === true)
            continue;
          setTimeout(() => {
            this.nodeCards[i].dispose = true;
            if (manual === true)
              this.propsService.NodesClosed.next([this.nodeCards[i].request, manual]);
          }, 1);
        }
        return;
      }
    }
  }

}

export type NodeInspectorItem = {
  id: string,
  color: number,
  display: string,
  dispose: boolean,
  location: number,
  moved: boolean,
  nodeitem: SvgElement | SyshubConfigItem | SyshubPSetItem | SyshubJobType | SyshubUserAccount | SyshubIppDevice | SyshubWorkflow | SyshubCertStoreItem,
  request: NodeInspectorRequest,
  type: string,
  zindex: number,
}
