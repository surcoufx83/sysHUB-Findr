import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SvgElement } from '../../workflow-ui/canvas/element';
import { SearchResult } from 'src/app/types';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { GraphModelProcessObject, SyshubPSetItem } from 'syshub-rest-module';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CacheService } from 'src/app/svc/cache.service';
import { PagepropsService } from 'src/app/svc/pageprops.service';

@Component({
  selector: 'app-node-inspector-workflow-process-node',
  templateUrl: './wf-process-node.component.html',
  styleUrl: './wf-process-node.component.scss'
})
export class NodeInspectorWfProcessNodeComponent implements OnDestroy, OnInit {

  @Input({ required: true }) nodeItem!: SvgElement;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  parameters: [string, string][] = [];
  parameterset?: SyshubPSetItem;
  moveNodeNextTo: { [key: string]: HTMLElement } = {};
  subs: Subscription[] = [];

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  getValueToCopy(text: string) {
    return text.replace(/\s\/\s/gi, '/');
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    const obj = (<GraphModelProcessObject>this.nodeItem.modeldata);
    const parms = obj.parameters.split(';');
    parms.forEach((kvpair) => {
      if (kvpair != '') {
        const key = kvpair.substring(0, kvpair.indexOf('='));
        this.parameters.push([key, kvpair.substring(key.length + 1)]);
      }
    });
    if (obj.parameterSetUuid != null && obj.parameterSetUuid !== '') {
      this.parameterset = this.cacheService.getPsetItemByUuid(obj.parameterSetUuid) ?? undefined;
    }
    this.subs.push(this.propsService.NodesOpened.subscribe((node) => {
      if (node.type === 'PSetItems' && this.moveNodeNextTo[(<SyshubPSetItem>node.node).uuid]) {
        const nodelement = this.document.getElementById(node.id!);
        const nodetarget = this.moveNodeNextTo[(<SyshubPSetItem>node.node).uuid];
        if (nodelement) {
          nodelement.style.left = `${Math.floor(+nodetarget.style.left.substring(0, nodetarget.style.left.length - 2) + 524)}px`;
          nodelement.style.top = `${nodetarget.style.top}`;
        }
      }
    }));
  }

  selectNode(node: SyshubPSetItem, event: MouseEvent): void {
    this.propsService.inspect('PSetItems', node);
    const target = (<HTMLElement>event.target).parentElement?.parentElement?.parentElement?.parentElement?.parentElement
    if (target) {
      this.moveNodeNextTo[node.uuid] = target;
    }
  }

}
