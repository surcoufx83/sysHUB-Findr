import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response, RestService, SyshubCertStoreItem, SyshubIppDevice, SyshubRole, SyshubServerInformation, SyshubUserAccount } from 'syshub-rest-module';
import { SearchConfig, SearchResultUuids } from '../types';
import { CacheService } from './cache.service';
import { ToastsService } from './toasts.service';
import { L10nService } from './i10n.service';
import { L10nLocale } from './i10n/l10n-locale';
import { sub } from 'date-fns';
import { ControlContainer } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _searchBusy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public searchBusy = this._searchBusy.asObservable();
  private _searchConfig: BehaviorSubject<SearchConfig> = new BehaviorSubject<SearchConfig>(defaultSearchConfig);
  public searchConfig = this._searchConfig.asObservable();
  private _searchProgress: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  public searchProgress = this._searchProgress.asObservable();

  private missingScope: boolean;

  constructor(
    private cache: CacheService,
    private l10nService: L10nService,
    private restapi: RestService,
    private toastsService: ToastsService,
    private router: Router) {
    let oldconfig = localStorage.getItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig');
    if (oldconfig != null) {
      let cfg: SearchConfig = <SearchConfig>JSON.parse(oldconfig);
      cfg.phrase = '';
      this._searchConfig.next({ ...cfg });
    }
    this.searchConfig.subscribe((config) => localStorage.setItem(environment.storage?.searchconfigKey ?? 'findr-searchconfig', JSON.stringify(config)));
    this.missingScope = (environment.api.syshub.oauth?.scope != 'private+public' && environment.api.syshub.oauth?.scope == 'public+private') || true;
  }

  public match(content: any, search: SearchConfig): boolean {
    if (!content)
      return false;
    return `${content}`.toLocaleLowerCase().includes(search.phrase.toLocaleLowerCase());
  }

  private matchIncludeDescription(description: string | null, search: SearchConfig): string {
    if (description === null)
      return '';
    if (!description.startsWith('[B]') || !search.filter.excludeBComments)
      return description;
    return '';
  }

  private matchIncludeUuid(uuid: string | null, search: SearchConfig): string {
    if (uuid === null)
      return '';
    return search.filter.includeUuids ? uuid : '';
  }

  public matchCertStoreItem(content: SyshubCertStoreItem, search: SearchConfig): boolean {
    return this.match(`${content.algorithm}${content.alias}${content.certX509IssuerDN}${content.certX509SubjectDN}${content.subjectAlternativeName}`, search);
  }

  public matchIppDevice(content: SyshubIppDevice, search: SearchConfig): boolean {
    return this.match(`${content.name}${content.desc}${content.form}${content.location}${content.uri}`, search);
  }

  public matchUser(content: SyshubUserAccount, search: SearchConfig): boolean {
    return this.match(`${content.email}${content.name}${this.matchIncludeUuid(content.uuid, search)}`, search);
  }

  public matchUserRole(content: SyshubRole, search: SearchConfig): boolean {
    return this.match(`${content.rolename}${this.matchIncludeDescription(content.description, search)}${this.matchIncludeUuid(content.uuid, search)}`, search);
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  public search(search: SearchConfig): boolean {
    if (search.phrase == '' || search.phrase.trim().length < (environment.app?.minPhraseLength ?? 3) || this._searchBusy.value == true)
      return false;
    this._searchBusy.next(true);
    this._searchProgress.next(0);
    search.token = this.cache.prepareSearch(search);
    this._searchConfig.next(search);
    this.router.navigate(['/search']);
    this.searchStep1(search);
    return true;
  }

  private searchStep1(search: SearchConfig): void {
    this.restapi.runWorkflowAlias('findr-search', search).subscribe((reply: Response) => {
      if (reply.status == HttpStatusCode.Ok) {
        this._searchProgress.next(50);
        this.searchStep2(search, <SearchResultUuids>reply.content);
      }
      else {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.content['message'] ?? 'Unknown error, see browser console']),
        });
        this._searchBusy.next(false);
        this._searchProgress.next(100);
      }
    });
  }

  private searchStep2_CertStore(enabled: boolean, phrase: string): Observable<{ keystore: SyshubCertStoreItem[], truststore: SyshubCertStoreItem[] } | null | false> {
    let subject = new Subject<{ keystore: SyshubCertStoreItem[], truststore: SyshubCertStoreItem[] } | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      let certstore: { keystore: SyshubCertStoreItem[], truststore: SyshubCertStoreItem[] } = { keystore: [], truststore: [] };
      this.restapi.getCertStoreItems('keystore').subscribe((store1) => {
        if (store1 instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        certstore.keystore = [...store1];
        this.restapi.getCertStoreItems('truststore').subscribe((store2) => {
          if (store2 instanceof Error) {
            subject.next(false);
            subject.complete();
            return;
          }
          certstore.truststore = [...store2];
          subject.next(certstore);
          subject.complete();
        });
      });
    }, 1);
    return subject;
  }

  private searchStep2_IppDevices(enabled: boolean, phrase: string): Observable<SyshubIppDevice[] | null | false> {
    let subject = new Subject<SyshubIppDevice[] | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      this.restapi.getDevices().subscribe((items) => {
        if (items instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        subject.next(items);
        subject.complete();
      });
    }, 1);
    return subject;
  }

  private searchStep2_ServerConfig(enabled: boolean, phrase: string): Observable<{ [key: string]: string } | null | false> {
    let subject = new Subject<{ [key: string]: string } | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      this.restapi.getServerProperties().subscribe((items) => {
        if (items instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        subject.next(items);
        subject.complete();
      });
    }, 1);
    return subject;
  }

  private searchStep2_ServerInfo(enabled: boolean, phrase: string): Observable<SyshubServerInformation | null | false> {
    let subject = new Subject<SyshubServerInformation | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      this.restapi.getServerInformation().subscribe((items) => {
        if (items instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        subject.next(items);
        subject.complete();
      });
    }, 1);
    return subject;
  }

  private searchStep2_User(enabled: boolean, phrase: string): Observable<SyshubUserAccount[] | null | false> {
    let subject = new Subject<SyshubUserAccount[] | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      this.restapi.getUsers().subscribe((items) => {
        if (items instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        subject.next(items);
        subject.complete();
      });
    }, 1);
    return subject;
  }

  private searchStep2_UserRoles(enabled: boolean, phrase: string): Observable<SyshubRole[] | null | false> {
    let subject = new Subject<SyshubRole[] | null | false>;
    setTimeout(() => {
      if (!enabled) {
        subject.next(null);
        subject.complete();
        return;
      }
      this.restapi.getRoles().subscribe((items) => {
        console.log(items)
        if (items instanceof Error) {
          subject.next(false);
          subject.complete();
          return;
        }
        subject.next(items);
        subject.complete();
      });
    }, 1);
    return subject;
  }

  private searchStep2(search: SearchConfig, result: SearchResultUuids): void {
    let systemTopics = search.topics.system.certstore || search.topics.system.ippDevices || search.topics.system.serverConfig || search.topics.system.serverInfo || search.topics.system.users || search.topics.system.userRoles;

    if (result.system == undefined) {
      result.system = {}
    }

    // Query individual Rest API endpoints. If search is not active, method will return null.
    this.searchStep2_CertStore(search.topics.system.certstore, search.phrase).subscribe((r) => {
      result.system!.certstore = (r === null || r === false) ? r : { matches: this.searchstep2_MatchCertStore(search, r), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });
    this.searchStep2_IppDevices(search.topics.system.ippDevices, search.phrase).subscribe((r) => {
      result.system!.ippDevices = (r === null || r === false) ? r : { matches: this.searchstep2_MatchDevice(search, r), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });
    this.searchStep2_ServerConfig(search.topics.system.serverConfig, search.phrase).subscribe((r) => {
      result.system!.serverConfig = (r === null || r === false) ? r : { matches: this.searchstep2_MatchContent(search, JSON.stringify(r).toLocaleLowerCase()), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });
    this.searchStep2_ServerInfo(search.topics.system.serverInfo, search.phrase).subscribe((r) => {
      result.system!.serverInfo = (r === null || r === false) ? r : { matches: this.searchstep2_MatchContent(search, JSON.stringify(r).toLocaleLowerCase()), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });
    this.searchStep2_User(search.topics.system.users, search.phrase).subscribe((r) => {
      result.system!.users = (r === null || r === false) ? r : { matches: this.searchstep2_MatchUser(search, r), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });
    this.searchStep2_UserRoles(search.topics.system.users || search.topics.system.userRoles, search.phrase).subscribe((r) => {
      result.system!.roles = (r === null || r === false) ? r : { matches: this.searchstep2_MatchRole(search, r), content: r };
      this._searchProgress.next(this._searchProgress.value + 8);
    });

    // Wait for individual Rest API calls finished with a timeout of 20 seconds
    this.searchstep2Timeout = 20000;
    setTimeout(() => {
      this.searchstep2_loop(search, systemTopics, result);
    }, 0);
  }

  private searchstep2_MatchContent(search: SearchConfig, content: string): number {
    const regex = new RegExp(search.phrase.toLocaleLowerCase(), 'gi');
    const matches = content.match(regex);
    return matches?.length || 0;
  }

  private searchstep2_MatchCertStore(search: SearchConfig, content: { keystore: SyshubCertStoreItem[], truststore: SyshubCertStoreItem[] }): number {
    let count = 0;
    content.keystore.forEach((cert) => count += this.matchCertStoreItem(cert, search) ? 1 : 0);
    content.truststore.forEach((cert) => count += this.matchCertStoreItem(cert, search) ? 1 : 0);
    return count;
  }

  private searchstep2_MatchDevice(search: SearchConfig, content: SyshubIppDevice[]): number {
    let count = 0;
    content.forEach((device) => count += this.matchIppDevice(device, search) ? 1 : 0);
    return count;
  }

  private searchstep2_MatchUser(search: SearchConfig, content: SyshubUserAccount[]): number {
    let count = 0;
    content.forEach((user) => count += this.matchUser(user, search) ? 1 : 0);
    return count;
  }

  private searchstep2_MatchRole(search: SearchConfig, content: SyshubRole[]): number {
    let count = 0;
    content.forEach((role) => count += this.matchUserRole(role, search) ? 1 : 0);
    return count;
  }

  private searchstep2Timeout = 20000;
  private searchstep2_loop(search: SearchConfig, searchSystemTopics: boolean, result: SearchResultUuids): void {
    console.log(result);
    if (!searchSystemTopics || this.searchstep2Timeout <= 0 || (result.system!.certstore !== undefined && result.system!.ippDevices !== undefined && result.system!.serverConfig !== undefined && result.system!.serverInfo !== undefined && result.system!.users !== undefined)) {
      this.cache.setResult(search.token, result);
      this._searchBusy.next(false);
      this._searchProgress.next(100);
      return;
    }
    setTimeout(() => {
      this.searchstep2Timeout -= 1000;
      this.searchstep2_loop(search, searchSystemTopics, result);
    }, 1000);
  }

}

export const defaultSearchConfig: SearchConfig = {
  phrase: '',
  token: '',
  topics: {
    config: true,
    jobtypes: true,
    parameterset: true,
    workflows: true,
    system: {
      certstore: false,
      serverConfig: false,
      serverInfo: false,
      ippDevices: false,
      users: false,
      userRoles: false,
    }
  },
  filter: {
    categoryFilter: null,
    excludeBComments: true,
    includeUuids: false,
    searchWorkflowContent: true,
  },
  options: {
    enableCache: true,
  }
}
