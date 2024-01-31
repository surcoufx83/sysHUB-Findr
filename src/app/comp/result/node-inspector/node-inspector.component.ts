import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';

@Component({
  selector: 'app-result-node-inspector',
  templateUrl: './node-inspector.component.html',
  styleUrl: './node-inspector.component.scss'
})
export class NodeInspectorComponent implements OnDestroy, OnInit {

  private nodeTypes = ['ConfigItems', 'JobTypes', 'PSetItems', 'WorkflowItems', 'CertStoreItems', 'IppDevices', 'ServerConfig', 'ServerInformation', 'Users', 'ImpExpView'];
  private subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.subs.push(this.propsService.NodeInspectorItem.subscribe((item) => {
      this.onInspectNewNodeItem(item.type, item.node);
    }))
  }

  onInspectNewNodeItem(type: string, node: any): void {
    if (!this.nodeTypes.includes(type))
      return;
    console.warn(node);
  }

}
