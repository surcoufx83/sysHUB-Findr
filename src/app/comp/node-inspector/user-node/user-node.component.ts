import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { SyshubRole, SyshubUserAccount } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-user-node',
  templateUrl: './user-node.component.html',
  styleUrl: './user-node.component.scss'
})
export class NodeInspectorUserNodeComponent implements OnDestroy, OnInit {

  @Input({ required: true }) nodeItem!: SyshubUserAccount;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult!: SearchResult;

  hideUnassignedRoles = false;
  showRolesGroup = true;
  userroles: SyshubRole[] = [];
  subs: Subscription[] = [];

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
    private toastsService: ToastsService,
  ) { }

  copy(text: string | number) {
    navigator.clipboard.writeText(`${text}`);
    this.toastsService.addToast({
      delay: 2500,
      message: this.l10n(this.l10nphrase.result.common.nodeInspector.copied, [text]),
    });
  }

  copyPath(text: string) {
    this.copy(text.replace(/\s\/\s/gi, '/'));
  }

  isempty(value: string | number | null | undefined): boolean {
    return value === undefined || value === null || value === '' || value === '%';
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.cacheService.userconfig.subscribe((cfg) => {
      this.hideUnassignedRoles = cfg.hideUnassignedRoles || false;
    }));
    if (this.searchResult.result?.system?.roles == undefined || this.searchResult.result?.system?.roles == null || this.searchResult.result?.system?.roles == false)
      return;
    let tempuserroles: SyshubRole[] = [];
    this.userroles = [...this.searchResult.result?.system?.roles.content].sort((a, b) => a.rolename.toLocaleLowerCase() > b.rolename.toLocaleLowerCase() ? 1 : -1);
  }

  toggleRolesItems(): void {
    this.cacheService.toggleUnassignedRolesFilter(!this.hideUnassignedRoles);
  }

}
