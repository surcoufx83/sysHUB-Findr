import { Component, EventEmitter, Input, Output } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SyshubCertStoreItem } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-certstore-node',
  templateUrl: './certstore-node.component.html',
  styleUrl: './certstore-node.component.scss'
})
export class NodeInspectorCertstoreNodeComponent {

  @Input({ required: true }) nodeItem!: SyshubCertStoreItem;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult?: SearchResult;

  showQueueSettingsGroup = true;

  constructor(
    private l10nService: L10nService,
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

}
