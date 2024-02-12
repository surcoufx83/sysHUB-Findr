import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SvgElement } from '../../workflow-ui/canvas/element';
import { SearchResult } from 'src/app/types';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { GraphModelProcessObject } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-workflow-process-node',
  templateUrl: './wf-process-node.component.html',
  styleUrl: './wf-process-node.component.scss'
})
export class NodeInspectorWfProcessNodeComponent implements OnInit {

  @Input({ required: true }) nodeItem!: SvgElement;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  showParametersGroup = true;
  parameters: [string, string][] = [];

  constructor(
    private l10nService: L10nService,
  ) {
    setTimeout(() => {
      console.log(this.nodeItem)
    }, 10);
  }

  getValueToCopy(text: string) {
    return text.replace(/\s\/\s/gi, '/');
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    const parms = (<GraphModelProcessObject>this.nodeItem.modeldata).parameters.split(';');
    parms.forEach((kvpair) => {
      if (kvpair != '') {
        const key = kvpair.substring(0, kvpair.indexOf('='));
        this.parameters.push([key, kvpair.substring(key.length + 1)]);
      }
    });
  }

}
