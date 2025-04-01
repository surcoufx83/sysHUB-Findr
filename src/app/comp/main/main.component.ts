import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { OAuthRestSettings } from 'syshub-rest-module';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {

  authType: 'basic' | 'apikey' | 'oauth' | undefined;
  missingConfig: boolean;
  missingScope: boolean;
  searchResult?: SearchResult;
  subs: Subscription[] = [];

  constructor(
    appInitService: AppInitService,
    private cacheService: CacheService,
    private l10nService: L10nService,
  ) {
    this.missingConfig = appInitService.environment.appInitializationFailure?.configStatusCode !== HttpStatusCode.Ok;
    if ('basic' in appInitService.environment.api) {
      this.missingScope = !appInitService.environment.api.basic.scope ? true : appInitService.environment.api.basic.scope !== 'private+public' && appInitService.environment.api.basic.scope !== 'public+private';
      this.authType = 'basic';
    }
    else if ('apikey' in appInitService.environment.api) {
      this.missingScope = true;
      this.authType = 'apikey';
    }
    else if ('oauth' in appInitService.environment.api) {
      this.missingScope = (<OAuthRestSettings>appInitService.environment.api).oauth.scope !== 'private+public' && (<OAuthRestSettings>appInitService.environment.api).oauth.scope !== 'public+private';
      this.authType = 'oauth';
    }
    else
      this.missingScope = true;
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.cacheService.searchresult.subscribe((result) => {
      setTimeout(() => {
        this.searchResult = result ?? undefined
      }, 1);
    }));
  }

}
