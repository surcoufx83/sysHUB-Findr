import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { SyshubConfigItem } from 'syshub-rest-module';

@Component({
  selector: 'app-result-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnDestroy, OnInit {

  fullConfigTree: SyshubConfigItem[] = [];
  @Input({ required: true }) configByTree: { [key: string]: SyshubConfigItem[] } = {};
  @Input({ required: true }) configTreeKeys: string[] = [];
  @Input({ required: true }) configUpdate: number | null = null;

  subs: Subscription[] = [];

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
    this.subs.push(this.cacheService.Config.subscribe((configtree) => {
      if (JSON.stringify(configtree) === JSON.stringify(this.fullConfigTree))
        return;
      this.fullConfigTree = [...configtree];
      console.log(this.fullConfigTree)
    }));
  }

}
