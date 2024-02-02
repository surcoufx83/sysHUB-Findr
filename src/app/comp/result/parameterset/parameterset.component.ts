import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-parameterset',
  templateUrl: './parameterset.component.html',
  styleUrl: './parameterset.component.scss'
})
export class ParametersetComponent implements OnDestroy, OnInit {

  fullPsetTree: SyshubPSetItem[] = [];
  psetTreeKeys: string[] = [];
  psetUuids: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
  @Input({ required: true }) psetByTree: { [key: string]: SyshubPSetItem[] } = {};
  @Input({ required: true }) psetUpdate: number | null = null;
  @Input({ required: true }) searchResult!: SearchResult;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  getPsetItemByUuid(uuid: string): SyshubPSetItem | null {
    return this.cacheService.getPsetItemByUuid(uuid);
  }

  getPsetTree(uuid: string | null, includeUuids: boolean = false): string {
    return this.cacheService.getPsetTree(uuid, includeUuids);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  private matchTree(tree: string): boolean {
    for (let i = 0; i < this.psetTreeKeys.length; i++) {
      if (this.psetTreeKeys[i].indexOf(tree) === 0)
        return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.subs.push(this.cacheService.Parameterset.subscribe((psettree) => {
      if (JSON.stringify(psettree) === JSON.stringify(this.fullPsetTree) && Object.keys(this.psetUuids).length > 0)
        return;
      let psetTreeKeys: string[] = [];
      let temppaths: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
      Object.keys(this.psetByTree).forEach((key) => {
        this.psetByTree[key].forEach((item) => psetTreeKeys.push(this.getPsetTree(item.uuid, true)));
      })
      this.psetTreeKeys = [...psetTreeKeys];
      this.ngOnInit_loopTree(temppaths, psettree);
      this.fullPsetTree = [...psettree];
      this.psetUuids = { ...temppaths };
    }));
  }

  ngOnInit_loopTree(temppaths: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] }, children: SyshubPSetItem[]) {
    children.forEach((item) => {
      const tree = this.getPsetTree(item.uuid, true);
      const match = this.matchTree(tree);
      temppaths[item.uuid] = [tree, match, match];
      this.ngOnInit_loopTree(temppaths, item.children);
    })
  }

}
