import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';
import { SyshubUserAccount } from 'syshub-rest-module';

@Component({
  selector: 'app-result-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  nodesToggled: string[] = [];
  @Input({ required: true }) searchResult!: SearchResult;
  @Input({ required: true }) showUnmatchedItems!: boolean;
  user: SyshubUserAccount[] = [];
  userMatched: string[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private propsService: PagepropsService,) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    if (this.searchResult!.result?.system?.users === undefined || this.searchResult!.result?.system?.users === null || this.searchResult!.result?.system?.users === false)
      return;
    this.user = [...this.searchResult.result.system.users.content].sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
    this.user.forEach((u) => {
      if (this.searchService.matchUser(u, this.searchResult.search))
        this.userMatched.push(u.uuid);
    });
  }

  hoverNode(node: SyshubUserAccount, event: MouseEvent): void {
    this.propsService.inspect('Users', node, 'show', {
      top: event.pageY - 74,
      left: event.pageX + 86,
    });
  }

  leaveNode(node: SyshubUserAccount): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.propsService.inspect('Users', node, 'remove');
  }

  selectNode(node: SyshubUserAccount): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.nodesToggled.push(node.uuid);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.uuid, 1));
  }
}