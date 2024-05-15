import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { VariableParserService } from 'src/app/svc/variable-parser.service';
import { SearchResult, VariableExpression } from 'src/app/types';
import { explodeParameters } from 'src/app/utils/syshub.helper';
import { GraphModelProcessObject, SyshubPSetItem } from 'syshub-rest-module';
import { SvgElement } from '../../workflow-ui/canvas/element';

@Component({
  selector: 'app-node-inspector-workflow-process-node',
  templateUrl: './wf-process-node.component.html',
  styleUrl: './wf-process-node.component.scss'
})
export class NodeInspectorWfProcessNodeComponent implements OnDestroy, OnInit {

  @Input({ required: true }) nodeItem!: SvgElement;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult?: SearchResult;
  @Input({ required: true }) showPsetTreeInProcessNodes!: boolean;

  parameters: [key: string, fulltext: string, variables: VariableExpression[]][] = [];
  parameterset?: SyshubPSetItem;
  parametersetMaxDeep: number = 0;
  parametersetPath: string = '';
  parametersetTreeUuids: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
  isTracingMe: boolean = false;
  moveNodeNextTo: { [key: string]: HTMLElement } = {};
  subs: Subscription[] = [];

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
    private varParserService: VariableParserService,
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
    this.ngOnInit_extractParams(obj);
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
    this.subs.push(this.propsService.TraceNode.subscribe((node) => {
      this.isTracingMe = node?.uuid === this.nodeItem.uuid;
    }));
    if (obj.parameterSetUuid != null && obj.parameterSetUuid !== '') {
      this.parameterset = this.cacheService.getPsetItemByUuid(obj.parameterSetUuid) ?? undefined;
      if (this.parameterset)
        this.ngOnInit_loopTree(this.parametersetTreeUuids, [this.parameterset], 0);
    }
  }

  ngOnInit_extractParams(obj: GraphModelProcessObject): void {
    let params = explodeParameters(obj.parameters);
    Object.keys(params).forEach((key) => {
      this.parameters.push([
        key,
        params[key],
        this.varParserService.parse(obj.name, key, params[key])
      ]);
    });
    if (obj.name == 'LoadParameterSet' || obj.name == 'LoadParameterSetFast') {
      this.parametersetMaxDeep = obj.name == 'LoadParameterSetFast' ? 1 : params['maxdeep'] ? +params['maxdeep'] : 999;
      if (params['psname'] && params['psname'] != '') {
        this.parameterset = this.cacheService.getPsetItemByPath(params['psname']) ?? undefined;
      }
    }
  }

  ngOnInit_loopTree(temppaths: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] }, children: SyshubPSetItem[], level: number) {
    children.forEach((item) => {
      const tree = this.cacheService.getPsetTree(item.uuid, true);
      if (level == 0)
        this.parametersetPath = this.cacheService.getPsetTree(item.uuid, false);
      const show = this.parametersetMaxDeep == 0 || level < this.parametersetMaxDeep;
      temppaths[item.uuid] = [tree, show, show];
      this.ngOnInit_loopTree(temppaths, item.children, level + 1);
    })
  }

  selectNode(node: SyshubPSetItem, event: MouseEvent): void {
    this.propsService.inspect('PSetItems', node);
    const target = (<HTMLElement>event.target).parentElement?.parentElement?.parentElement?.parentElement?.parentElement
    if (target)
      this.moveNodeNextTo[node.uuid] = target;
  }

  toggleShowPsetTree(): void {
    this.cacheService.toggleShowPsetTreeInProcessNodes(!this.showPsetTreeInProcessNodes);
  }

  traceMe(): void {
    this.propsService.TraceNode.next(this.isTracingMe ? undefined : this.nodeItem);
  }

}
