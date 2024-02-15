import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
import { CacheService } from 'src/app/svc/cache.service';
import { SearchResult } from 'src/app/types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {

  missingScope: boolean;
  searchResult?: SearchResult;
  subs: Subscription[] = [];

  constructor(
    appInitService: AppInitService,
    private cacheService: CacheService,
  ) {
    this.missingScope = (appInitService.environment.api.syshub.basic?.enabled || false) === true ? false : (appInitService.environment.api.syshub.oauth?.scope !== 'private+public' && appInitService.environment.api.syshub.oauth?.scope !== 'public+private');
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
