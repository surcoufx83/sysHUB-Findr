import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-config-node',
  templateUrl: './config-node.component.html',
  styleUrl: './config-node.component.scss'
})
export class NodeInspectorConfigNodeComponent implements OnInit {

  @Input({ required: true }) nodeItem!: SyshubConfigItem;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  configPath: string = '';

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
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
    this.configPath = this.cacheService.getConfigTree(this.nodeItem.uuid, false);
  }

}
