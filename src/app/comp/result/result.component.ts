import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SearchResult, SearchResultCertStoreContent, SimpleKeyValue } from 'src/app/types';
import { SyshubConfigItem, SyshubIppDevice, SyshubJobType, SyshubPSetItem, SyshubUserAccount, SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnDestroy, OnInit {

  selectedChapter: '' | 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems' | 'CertStoreItems' | 'IppDevices' | 'ServerConfig' | 'ServerInformation' | 'Users' | 'ImpExpView' = '';
  searchResult: SearchResult | null = null;
  totalMatchCount: number = 0;

  certstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };
  configByTree: { [key: string]: SyshubConfigItem[] } = {};
  configTreeKeys: string[] = [];
  configUpdate: number | null = null;
  showUnmatched: boolean = true;
  ippDevices: SyshubIppDevice[] = [];
  jobtypes: SyshubJobType[] = [];
  psetByTree: { [key: string]: SyshubPSetItem[] } = {};
  psetTreeKeys: string[] = [];
  psetUpdate: number | null = null;
  serverInfo: SimpleKeyValue[] = [];
  serverProperties: SimpleKeyValue[] = [];
  user: SyshubUserAccount[] = [];
  workflows: SyshubWorkflow[] = [];

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  getConfigItemByUuid(uuid: string): SyshubConfigItem | null {
    return this.cacheService.getConfigItemByUuid(uuid);
  }

  getConfigTree(uuid: string | null): string {
    return this.cacheService.getConfigTree(uuid);
  }

  getMatches(obj: { matches: number, content: any } | null | false | undefined): number {
    if (obj === null || obj === undefined || obj === false)
      return 0;
    return obj.matches;
  }

  getPsetItemByUuid(uuid: string): SyshubPSetItem | null {
    return this.cacheService.getPsetItemByUuid(uuid);
  }

  getPsetTree(uuid: string | null): string {
    return this.cacheService.getPsetTree(uuid);
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  ngOnInit(): void {
    this.showUnmatched = this.cacheService.showUnmatchedItems;
    this.subs.push(this.cacheService.searchresult.subscribe((result) => {
      this.ngOnInit_updateItems(result);
    }));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      if (map.has('t')) {
        if (!this.cacheService.loadSearchResult(map.get('t')!))
          this.router.navigate(['/']);
      } else
        this.router.navigate(['/']);
      let view = map.get('view') ?? '';
      if (view == '' || view == 'ConfigItems' || view == 'JobTypes' || view == 'PSetItems' || view == 'WorkflowItems' || view == 'CertStoreItems' || view == 'IppDevices' || view == 'ServerConfig' || view == 'ServerInformation' || view == 'Users')
        this.selectedChapter = view;
      if (map.has('unmatched')) {
        this.showUnmatched = (map.get('unmatched') ?? 'show') == 'show';
        this.cacheService.toggleShowUnmatchedItems(this.showUnmatched);
      }
    }));
  }

  ngOnInit_updateItems(result: SearchResult | null): void {

    if (result?.search.phrase != this.searchResult?.search.phrase || result == null) {
      this.ngOnInit_updateItems_clearOldData();
    }

    this.searchResult = result !== null ? { ...result } : null;

    if (this.searchResult == null)
      return;

    this.ngOnInit_prepareCertstore();
    this.ngOnInit_prepareConfig();
    this.ngOnInit_prepareIppDevices();
    this.ngOnInit_prepareJobtypes();
    this.ngOnInit_preparePset();
    this.ngOnInit_prepareServerConfig();
    this.ngOnInit_prepareServerInfo();
    this.ngOnInit_prepareUser();
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

  ngOnInit_updateItems_clearOldData(): void {
    this.certstore = { keystore: [], truststore: [] };
    this.configByTree = {};
    this.configTreeKeys = [];
    this.configUpdate = null;
    this.ippDevices = [];
    this.jobtypes = [];
    this.psetByTree = {};
    this.psetTreeKeys = [];
    this.psetUpdate = null;
    this.serverInfo = [];
    this.serverProperties = [];
    this.user = [];
    this.workflows = [];
  }

  ngOnInit_prepareCertstore(): void {
    if (this.searchResult!.result?.system?.certstore === undefined || this.searchResult!.result?.system?.certstore === null || this.searchResult!.result?.system?.certstore === false)
      return;
    let tempcertstore: SearchResultCertStoreContent = { keystore: [], truststore: [] };
    this.searchResult!.result?.system?.certstore.content.keystore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult!.search))
        tempcertstore.keystore.push(cert);
    });
    this.searchResult!.result?.system?.certstore.content.truststore.forEach((cert) => {
      if (this.searchService.matchCertStoreItem(cert, this.searchResult!.search))
        tempcertstore.truststore.push(cert);
    });
    this.certstore = { ...tempcertstore };
  }

  ngOnInit_prepareConfig(): void {
    this.subs.push(this.cacheService.ConfigUpdated.subscribe((when) => {
      if (when === this.configUpdate || when === null)
        return;
      let newtree: { [key: string]: SyshubConfigItem[] } = {};
      this.searchResult!.result?.config.forEach((item) => {
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
    if (this.searchResult!.result?.system?.ippDevices === undefined || this.searchResult!.result?.system?.ippDevices === null || this.searchResult!.result?.system?.ippDevices === false)
      return;
    let tempippDevices: SyshubIppDevice[] = [];
    this.searchResult!.result?.system?.ippDevices.content.forEach((device) => {
      if (this.searchService.matchIppDevice(device, this.searchResult!.search))
        tempippDevices.push(device);
    });
    this.ippDevices = [...tempippDevices];
  }

  ngOnInit_prepareJobtypes(): void {
    this.subs.push(this.cacheService.Jobtypes.subscribe(() => {
      let tempjobtypes: SyshubJobType[] = [];
      this.searchResult!.result?.jobtypes.forEach((jtobj) => {
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
      this.searchResult!.result?.parameterset.forEach((item) => {
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

  ngOnInit_prepareServerConfig(): void {
    if (this.searchResult!.result?.system?.serverConfig === undefined || this.searchResult!.result?.system?.serverConfig === null || this.searchResult!.result?.system?.serverConfig === false)
      return;
    let tempserverProperties: SimpleKeyValue[] = [];
    Object.entries(this.searchResult!.result.system.serverConfig.content).forEach((kvpair) => {
      if (this.searchService.match(kvpair[0], this.searchResult!.search) || this.searchService.match(kvpair[1], this.searchResult!.search))
        tempserverProperties.push({ key: kvpair[0], value: this.ngOnInit_prepareServerConfig_convert(kvpair[1]) });
    });
    this.serverProperties = [...tempserverProperties].sort((a, b) => a.key.toLocaleLowerCase() > b.key.toLocaleLowerCase() ? 1 : a.key.toLocaleLowerCase() < b.key.toLocaleLowerCase() ? -1 : a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase() ? 1 : a.value.toLocaleLowerCase() < b.value.toLocaleLowerCase() ? -1 : 0);
  }

  ngOnInit_prepareServerConfig_convert(strin: any): any {
    if (!strin)
      return '';
    const teststr = `${strin}`.toLocaleLowerCase();
    if (teststr === 'true' || teststr === 'false')
      return teststr === 'true' ? true : false;
    if (!isNaN(Number(teststr)))
      return Number(teststr);
    return strin;
  }

  ngOnInit_prepareServerInfo(): void {
    if (this.searchResult!.result?.system?.serverInfo === undefined || this.searchResult!.result?.system?.serverInfo === null || this.searchResult!.result?.system?.serverInfo === false)
      return;
    let tempserverInfo: SimpleKeyValue[] = [];
    Object.entries(<{ [key: string]: any }>this.searchResult!.result.system.serverInfo.content).forEach((kvpair) => {
      if (Array.isArray(kvpair[1]))
        kvpair[1] = JSON.stringify(kvpair[1]);
      if (this.searchService.match(kvpair[0], this.searchResult!.search) || this.searchService.match(kvpair[1], this.searchResult!.search))
        tempserverInfo.push({ key: kvpair[0], value: this.ngOnInit_prepareServerConfig_convert(kvpair[1]) });
    });
    this.serverInfo = [...tempserverInfo].sort((a, b) => a.key.toLocaleLowerCase() > b.key.toLocaleLowerCase() ? 1 : a.key.toLocaleLowerCase() < b.key.toLocaleLowerCase() ? -1 : a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase() ? 1 : a.value.toLocaleLowerCase() < b.value.toLocaleLowerCase() ? -1 : 0);
  }

  ngOnInit_prepareUser(): void {
    if (this.searchResult!.result?.system?.users === undefined || this.searchResult!.result?.system?.users === null || this.searchResult!.result?.system?.users === false)
      return;
    let tempuser: SyshubUserAccount[] = [];
    this.searchResult!.result.system.users.content.forEach((user) => {
      if (this.searchService.matchUser(user, this.searchResult!.search))
        tempuser.push(user);
    });
    this.user = [...tempuser].sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  ngOnInit_prepareWorkflows(): void {
    this.subs.push(this.cacheService.Workflows.subscribe(() => {
      let tempworkflows: SyshubWorkflow[] = [];
      this.searchResult!.result?.workflows.forEach((wfobj) => {
        const wf = this.cacheService.getWorkflow(wfobj.uuid);
        if (wf != null)
          tempworkflows.push(wf);
      });
      this.workflows = [...tempworkflows];
    }));
  }

  onExportResultBtnClick(): void {
    if (!this.searchResult)
      return;
    const data = JSON.stringify(this.searchResult, null, 2);
    const blobdata = new Blob([data], {
      type: 'application/json'
    });
    let link = this.document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = URL.createObjectURL(blobdata);
    link.download = `Findr search for ${encodeURI(this.searchResult.search.phrase)}.json`;
    this.document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
