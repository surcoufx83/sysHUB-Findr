import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchConfig, SearchResult } from 'src/app/types';
import { SyshubConfigItem, SyshubJobType, SyshubPSetItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnDestroy, OnInit {

  @Input({ required: true }) searchResult!: SearchResult;

  configByTree: { [key: string]: SyshubConfigItem[] } = {};
  configTreeKeys: string[] = [];
  configUpdate: number | null = null;

  jobtypes: SyshubJobType[] = [];

  psetByTree: { [key: string]: SyshubPSetItem[] } = {};
  psetTreeKeys: string[] = [];
  psetUpdate: number | null = null;

  subs: Subscription[] = [];

  totalMatchCount: number = 0;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private router: Router,
    private route: ActivatedRoute) { }

  getIcon(type: string, value: any = null) {
    return this.cacheService.getIcon(type, value);
  }

  getConfigItemByUuid(uuid: string): SyshubConfigItem | null {
    return this.cacheService.getConfigItemByUuid(uuid);
  }

  getConfigTree(uuid: string | null): string {
    return this.cacheService.getConfigTree(uuid);
  }

  getPsetItemByUuid(uuid: string): SyshubPSetItem | null {
    return this.cacheService.getPsetItemByUuid(uuid);
  }

  getPsetTree(uuid: string | null): string {
    return this.cacheService.getPsetTree(uuid);
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
    this.ngOnInit_prepareConfig();
    this.ngOnInit_prepareJobtypes();
    this.ngOnInit_preparePset();

    this.totalMatchCount = (this.searchResult.result?.config?.length || 0) +
      (this.searchResult.result?.jobtypes?.length || 0) +
      (this.searchResult.result?.parameterset?.length || 0) +
      (this.searchResult.result?.workflows?.length || 0) +
      (this.searchResult.result?.system?.certstore ? this.searchResult.result?.system?.certstore.matches || 0 : 0) +
      (this.searchResult.result?.system?.ippDevices ? this.searchResult.result?.system?.ippDevices.matches || 0 : 0) +
      (this.searchResult.result?.system?.serverConfig ? this.searchResult.result?.system?.serverConfig.matches || 0 : 0) +
      (this.searchResult.result?.system?.serverInfo ? this.searchResult.result?.system?.serverInfo.matches || 0 : 0) +
      (this.searchResult.result?.system?.users ? this.searchResult.result?.system?.users.matches || 0 : 0);
  }

  ngOnInit_prepareConfig(): void {
    this.subs.push(this.cacheService.ConfigUpdated.subscribe((when) => {
      if (when === this.configUpdate || when === null)
        return;
      let newtree: { [key: string]: SyshubConfigItem[] } = {};
      this.searchResult.result?.config.forEach((item) => {
        let config = this.getConfigItemByUuid(item.uuid);
        if (config !== null) {
          let tree = this.getConfigTree(item.uuid);
          if (newtree[tree] == undefined)
            newtree[tree] = []
          newtree[tree].push(config);
        }
      });
      this.configByTree = { ...newtree };
      this.configTreeKeys = Object.keys(this.configByTree).sort((a, b) => a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1);
    }));
  }

  ngOnInit_prepareJobtypes(): void {
    this.subs.push(this.cacheService.jobtypes.subscribe(() => {
      let tempjobtypes: SyshubJobType[] = [];
      this.searchResult.result?.jobtypes.forEach((jtobj) => {
        const jt = this.cacheService.getJobtypeByUuid(jtobj.uuid);
        if (jt != null)
          tempjobtypes.push(jt);
      });
      this.jobtypes = [...tempjobtypes];
    }));
  }

  ngOnInit_preparePset(): void {
    this.subs.push(this.cacheService.ParametersetUpdated.subscribe((when) => {
      if (when === this.psetUpdate || when === null)
        return;
      let newtree: { [key: string]: SyshubPSetItem[] } = {};
      this.searchResult.result?.parameterset.forEach((item) => {
        let psitem = this.getPsetItemByUuid(item.uuid);
        if (psitem !== null) {
          let tree = this.getPsetTree(item.uuid);
          if (newtree[tree] == undefined)
            newtree[tree] = []
          newtree[tree].push(psitem);
        }
      });
      this.psetByTree = { ...newtree };
      this.psetTreeKeys = Object.keys(this.psetByTree).sort((a, b) => a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1);
    }));
  }

}
