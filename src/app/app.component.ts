import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RestService } from 'syshub-rest-module';
import { PagepropsService } from './svc/pageprops.service';
import { AppInitService } from './svc/app-init.service';
import { HttpStatusCode } from '@angular/common/http';
import { ToastsService } from './svc/toasts.service';
import { L10nService } from './svc/i10n.service';
import { L10nLocale } from './svc/i10n/l10n-locale';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string = 'sysHUB Findr';
  isLoggedIn?: boolean;

  constructor(
    private initService: AppInitService,
    private l10nService: L10nService,
    private pageprops: PagepropsService,
    private restapi: RestService,
    router: Router,
    private toastsService: ToastsService,
  ) {
    this.restapi.isLoggedIn.subscribe((state) => {
      if (this.isLoggedIn === true && state === false) {
        router.navigate(['/login']);
      }
      else if (this.isLoggedIn === false && state === true) {
        router.navigate(['/']);
      }
      this.isLoggedIn = state;
    });
    this.pageprops.pagetitle.subscribe((title) => this.title = title);
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.isLoggedIn === true) {
          if (event.url === '/login')
            router.navigate(['/']);
        }
        else if (this.isLoggedIn === false) {
          if (event.url !== '/login')
            router.navigate(['/login']);
        }
      }
    });
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnInit(): void {
    if (this.initService.environment.appInitializationFailure?.configStatusCode !== HttpStatusCode.Ok) {
      setTimeout(() => {
        this.toastsService.addDangerToast({
          message: this.l10nphrase.app.configurationFileMissing,
          autohide: false,
          isHtml: true,
        })
      }, 10);
    }
  }

}
