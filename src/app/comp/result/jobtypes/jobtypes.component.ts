import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult } from 'src/app/types';
import { SyshubJobType } from 'syshub-rest-module';

@Component({
  selector: 'app-result-jobtypes',
  templateUrl: './jobtypes.component.html',
  styleUrl: './jobtypes.component.scss'
})
export class JobtypesComponent implements OnDestroy, OnInit {

  jobtypes: SyshubJobType[] = [];
  jobtypesMatched: string[] = [];
  nodesToggled: string[] = [];
  @Input({ required: true }) searchResult!: SearchResult;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
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

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.jobtypesMatched = this.searchResult.result?.jobtypes.map((obj) => obj.uuid) || [];
    this.subs.push(this.cacheService.Jobtypes.subscribe((jobtypes) => {
      if (JSON.stringify(this.jobtypes) === JSON.stringify(jobtypes))
        return;
      this.jobtypes = jobtypes.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
    }));
  }

  hoverNode(node: SyshubJobType, event: MouseEvent): void {
    this.propsService.inspect('JobTypes', node, 'show', {
      top: event.pageY - 256,
      left: event.pageX + 86,
    });
  }

  leaveNode(node: SyshubJobType): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.propsService.inspect('JobTypes', node, 'remove');
  }

  selectNode(node: SyshubJobType): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.nodesToggled.push(node.uuid);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.uuid, 1));
  }
}