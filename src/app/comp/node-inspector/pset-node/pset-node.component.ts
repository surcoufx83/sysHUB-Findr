import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-pset-node',
  templateUrl: './pset-node.component.html',
  styleUrl: './pset-node.component.scss'
})
export class NodeInspectorPsetNodeComponent implements OnInit {

  @Input({ required: true }) nodeItem!: SyshubPSetItem;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  psetPath: string = '';

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private toastsService: ToastsService,
  ) { }

  copy(text: string) {
    navigator.clipboard.writeText(text);
    this.toastsService.addToast({
      delay: 2500,
      message: this.l10n(this.l10nphrase.result.common.nodeInspector.copied, [text]),
    });
  }

  copyPath(text: string) {
    this.copy(text.replace(/\s\/\s/gi, '/'));
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    this.psetPath = this.cacheService.getPsetTree(this.nodeItem.uuid, false);
  }

}
