import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchConfig, SearchResult, SearchResultCertStoreContent } from 'src/app/types';
import { SyshubCertStoreItem, SyshubConfigItem, SyshubIppDevice, SyshubJobType, SyshubPSetItem, SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-result-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnDestroy, OnInit {

  @Input({ required: true }) searchResult!: SearchResult;

  certstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };

  configByTree: { [key: string]: SyshubConfigItem[] } = {};
  configTreeKeys: string[] = [];
  configUpdate: number | null = null;

  ippDevices: SyshubIppDevice[] = [];
  jobtypes: SyshubJobType[] = [];

  psetByTree: { [key: string]: SyshubPSetItem[] } = {};
  psetTreeKeys: string[] = [];
  psetUpdate: number | null = null;

  workflows: SyshubWorkflow[] = [];

  subs: Subscription[] = [];

  totalMatchCount: number = 0;

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
    this.ngOnInit_prepareCertstore();
    this.ngOnInit_prepareConfig();
    this.ngOnInit_prepareIppDevices();
    this.ngOnInit_prepareJobtypes();
    this.ngOnInit_preparePset();
    this.ngOnInit_prepareWorkflows();

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

  ngOnInit_prepareCertstore(): void {
    if (this.searchResult.result?.system?.certstore === undefined || this.searchResult.result?.system?.certstore === null || this.searchResult.result?.system?.certstore === false)
      return;
    let tempcertstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };
    this.searchResult.result?.system?.certstore.content.keystore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult.search))
        tempcertstore.keystore.push(cert);
    });
    this.searchResult.result?.system?.certstore.content.truststore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult.search))
        tempcertstore.truststore.push(cert);
    });
    this.certstore = { ...tempcertstore };
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

  ngOnInit_prepareIppDevices(): void {
    if (this.searchResult.result?.system?.ippDevices === undefined || this.searchResult.result?.system?.ippDevices === null || this.searchResult.result?.system?.ippDevices === false)
      return;
    let tempippDevices: SyshubIppDevice[] = [];
    this.searchResult.result?.system?.ippDevices.content.forEach((device) => {
      if (this.searchService.matchIppDevice(device, this.searchResult.search))
        tempippDevices.push(device);
    });
    this.ippDevices = [...tempippDevices];
    console.log(this.ippDevices)
  }

  ngOnInit_prepareJobtypes(): void {
    this.subs.push(this.cacheService.Jobtypes.subscribe(() => {
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

  ngOnInit_prepareWorkflows(): void {
    this.subs.push(this.cacheService.Workflows.subscribe(() => {
      let tempworkflows: SyshubWorkflow[] = [];
      this.searchResult.result?.workflows.forEach((wfobj) => {
        const wf = this.cacheService.getWorkflow(wfobj.uuid);
        if (wf != null)
          tempworkflows.push(wf);
      });
      this.workflows = [...tempworkflows];
    }));
  }

}
