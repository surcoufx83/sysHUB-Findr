import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SvgElement } from '../../workflow-ui/canvas/element';
import { Subscription } from 'rxjs';
import { PagepropsService } from 'src/app/svc/pageprops.service';

@Component({
  selector: 'app-node-inspector-workflow-celement-node',
  templateUrl: './wf-celement-node.component.html',
  styleUrl: './wf-celement-node.component.scss'
})
export class NodeInspectorWfCelementNodeComponent implements OnDestroy, OnInit {

  @Input({ required: true }) nodeItem!: SvgElement;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult?: SearchResult;

  private sub?: Subscription;
  isTracingMe: boolean = false;

  constructor(
    private l10nService: L10nService,
    private propsService: PagepropsService,
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
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.propsService.TraceNode.subscribe((node) => {
      this.isTracingMe = node?.uuid === this.nodeItem.uuid;
    });
  }

  traceMe(): void {
    this.propsService.TraceNode.next(this.isTracingMe ? undefined : this.nodeItem);
  }

}
