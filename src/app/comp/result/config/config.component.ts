import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult } from 'src/app/types';
import { SyshubConfigItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnDestroy, OnInit {

  fullConfigTree: SyshubConfigItem[] = [];
  configTreeKeys: string[] = [];
  configUuids: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
  @Input({ required: true }) configByTree: { [key: string]: SyshubConfigItem[] } = {};
  @Input({ required: true }) configUpdate: number | null = null;
  @Input({ required: true }) searchResult!: SearchResult;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  getConfigItemByUuid(uuid: string): SyshubConfigItem | null {
    return this.cacheService.getConfigItemByUuid(uuid);
  }

  getConfigTree(uuid: string | null, includeUuids: boolean = false): string {
    return this.cacheService.getConfigTree(uuid, includeUuids);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  private matchTree(tree: string): boolean {
    for (let i = 0; i < this.configTreeKeys.length; i++) {
      if (this.configTreeKeys[i].indexOf(tree) === 0)
        return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.subs.push(this.cacheService.Config.subscribe((configtree) => {
      if (JSON.stringify(configtree) === JSON.stringify(this.fullConfigTree) && Object.keys(this.configUuids).length > 0)
        return;
      let configTreeKeys: string[] = [];
      let temppaths: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] } = {};
      Object.keys(this.configByTree).forEach((key) => {
        this.configByTree[key].forEach((item) => configTreeKeys.push(this.getConfigTree(item.uuid, true)));
      })
      this.configTreeKeys = [...configTreeKeys];
      this.ngOnInit_loopTree(temppaths, configtree);
      this.fullConfigTree = [...configtree];
      this.configUuids = { ...temppaths };
    }));
  }

  ngOnInit_loopTree(temppaths: { [key: string]: [path: string, defaultOpen: boolean, open: boolean] }, children: SyshubConfigItem[]) {
    children.forEach((item) => {
      const tree = this.getConfigTree(item.uuid, true);
      const match = this.matchTree(tree);
      temppaths[item.uuid] = [tree, match, match];
      this.ngOnInit_loopTree(temppaths, item.children);
    })
  }

}
