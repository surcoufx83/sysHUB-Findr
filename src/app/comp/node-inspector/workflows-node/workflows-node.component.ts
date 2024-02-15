import { Component, EventEmitter, Input, Output } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-workflows-node',
  templateUrl: './workflows-node.component.html',
  styleUrl: './workflows-node.component.scss'
})
export class NodeInspectorWorkflowsNodeComponent {

  @Input({ required: true }) nodeItem!: SyshubWorkflow;
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
