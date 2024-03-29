import { Injectable } from '@angular/core';
import { NavigationEnd, Event as NavigationEvent, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Subject } from 'rxjs';
import { SyshubCertStoreItem, SyshubConfigItem, SyshubIppDevice, SyshubJobType, SyshubPSetItem, SyshubUserAccount, SyshubWorkflow } from 'syshub-rest-module';
import { L10nService } from './i10n.service';
import { SvgElement } from '../comp/workflow-ui/canvas/element';

@Injectable({
  providedIn: 'root'
})
export class PagepropsService {

  private appTheme$: BehaviorSubject<'light' | 'dark' | 'auto' | null> = new BehaviorSubject<'light' | 'dark' | 'auto' | null>(null);
  public AppTheme = this.appTheme$.asObservable();

  private deviceType$: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  private nodeInspectorItem$ = new Subject<NodeInspectorRequest>();
  public NodeInspectorItem = this.nodeInspectorItem$.asObservable();
  public NodesOpened = new Subject<NodeInspectorRequest>();
  public NodesClosed = new Subject<NodeInspectorRequest>();

  private pages: PageTitleItem[] = [
    { pattern: new RegExp(/^\/$/), text: 'sysHUB Findr' },
    { pattern: new RegExp(/^\/result/), i10n: 'app.titles.resultView' },
    { pattern: new RegExp(/^\/search$/), i10n: 'app.titles.searchOngoing' },
  ];
  private _pagetitle: BehaviorSubject<string> = new BehaviorSubject<string>('sysHUB Findr');
  public pagetitle = this._pagetitle.asObservable();

  constructor(
    private i10nService: L10nService,
    private router: Router,
    device: DeviceDetectorService,
  ) {

    this.deviceType$ = device.isDesktop() ? 'desktop' : device.isMobile() ? 'mobile' : 'tablet';

    this.loadDefaultTheme();

    this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          let found: boolean = false;
          for (let i = 0; i < this.pages.length; i++) {
            let page = this.pages[i];
            let match = event.url.match(page.pattern);
            if (match != null) {
              if (page.text != undefined)
                this._pagetitle.next(page.text);
              else if (page.i10n != undefined) {
                if (page.i10nargs == undefined)
                  this._pagetitle.next(this.l10n(page.i10n));
                else {
                  let args: string[] = [];
                  for (let i = 0; i < page.i10nargs.length; i++) {
                    if (page.i10nargs[i].startsWith('match.'))
                      args.push(match.groups![page.i10nargs[i].substring(6)]);
                    else
                      args.push(page.i10nargs[i]);
                  }
                  this._pagetitle.next(this.l10n(page.i10n, args));
                }
              }
              found = true;
              break;
            }
          }
          if (!found)
            this._pagetitle.next(event.url);
        }
      }
    );
  }

  public applyTheme(theme: 'light' | 'dark' | null): void {
    if (theme == null) {
      const deviceMode = window.matchMedia("(prefers-color-scheme: dark)");
      document.body.setAttribute('data-bs-theme', deviceMode.matches ? 'dark' : 'light');
      this.appTheme$.next('auto');
      localStorage.removeItem(`findr-syshub-theme`);
      return;
    }
    document.body.setAttribute('data-bs-theme', theme);
    this.appTheme$.next(theme);
    localStorage.setItem(`findr-syshub-theme`, theme);
  }

  public get DeviceType(): 'mobile' | 'tablet' | 'desktop' {
    return this.deviceType$;
  }

  public inspect(
    type: 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems' | 'CertStoreItems' | 'IppDevices' | 'ServerConfig' | 'ServerInformation' | 'Users' | 'ImpExpView' | 'SvgNode',
    node: SvgElement | SyshubConfigItem | SyshubPSetItem | SyshubJobType | SyshubUserAccount | SyshubIppDevice | SyshubWorkflow | SyshubCertStoreItem,
    action?: 'show' | 'remove',
    placeAt?: { top?: number, left?: number, right?: number, }): void {
    this.nodeInspectorItem$.next({
      type: type,
      node: node,
      action: action ?? 'show',
      placeAt: placeAt,
    });
  }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  private loadDefaultTheme(): void {
    const storemode: string | null = localStorage.getItem(`findr-syshub-theme`);
    if (storemode == null || storemode === 'dark' || storemode === 'light') {
      this.applyTheme(storemode);
      return;
    }
    this.applyTheme(null);
  }

}

export type PageTitleItem = {
  pattern: RegExp;
  text?: string;
  i10n?: string;
  i10nargs?: string[];
}

export type NodeInspectorRequest = {
  action: 'show' | 'remove',
  id?: string,
  node: SvgElement | SyshubConfigItem | SyshubPSetItem | SyshubJobType | SyshubUserAccount | SyshubIppDevice | SyshubWorkflow | SyshubCertStoreItem,
  placeAt?: { top?: number, left?: number, right?: number, },
  type: 'ConfigItems' | 'JobTypes' | 'PSetItems' | 'WorkflowItems' | 'CertStoreItems' | 'IppDevices' | 'ServerConfig' | 'ServerInformation' | 'Users' | 'ImpExpView' | 'SvgNode',
}
