import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-workflows-node',
  templateUrl: './workflows-node.component.html',
  styleUrl: './workflows-node.component.scss'
})
export class NodeInspectorWorkflowsNodeComponent implements OnInit {

  @Input({ required: true }) nodeItem!: SyshubWorkflow;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private toastsService: ToastsService,
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

  ngOnInit(): void {

  }

}
