import { Injectable } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { L10nService } from './i10n.service';

@Injectable({
  providedIn: 'root'
})
export class PagepropsService {

  private pages: PageTitleItem[] = [
    { pattern: new RegExp(/^\/$/), text: 'sysHUB Findr' },
    { pattern: new RegExp(/^\/result/), i10n: 'app.titles.resultView' },
    { pattern: new RegExp(/^\/search$/), i10n: 'app.titles.searchOngoing' },
  ];
  private _pagetitle: BehaviorSubject<string> = new BehaviorSubject<string>('sysHUB Findr');
  public pagetitle: Observable<string> = this._pagetitle.asObservable();

  constructor(private i10nService: L10nService, private router: Router) {

    const deviceMode = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.setAttribute('data-bs-theme', deviceMode.matches ? 'dark' : 'light');

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

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

}

export interface PageTitleItem {
  pattern: RegExp;
  text?: string;
  i10n?: string;
  i10nargs?: string[];
}
