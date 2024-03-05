import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { SearchResult } from 'src/app/types';
import { OAuthRestSettings } from 'syshub-rest-module';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {

  missingConfig: boolean;
  missingScope: boolean;
  searchResult?: SearchResult;
  subs: Subscription[] = [];

  constructor(
    appInitService: AppInitService,
    private cacheService: CacheService,
  ) {
    this.missingConfig = appInitService.environment.appInitializationFailure?.configStatusCode !== HttpStatusCode.Ok;
    this.missingScope = Object.keys(appInitService.environment.api).includes('basic') === true ? false : ((<OAuthRestSettings>appInitService.environment.api).oauth.scope !== 'private+public' && (<OAuthRestSettings>appInitService.environment.api).oauth.scope !== 'public+private');
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
