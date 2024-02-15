import { Component, EventEmitter, Input, Output } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SvgElement } from '../../workflow-ui/canvas/element';

@Component({
  selector: 'app-node-inspector-workflow-workflow-node',
  templateUrl: './wf-workflow-node.component.html',
  styleUrl: './wf-workflow-node.component.scss'
})
export class NodeInspectorWfWorkflowNodeComponent {

  @Input({ required: true }) nodeItem!: SvgElement;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult?: SearchResult;

  constructor(
    private l10nService: L10nService,
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

}
