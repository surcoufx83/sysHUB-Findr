import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchResult } from 'src/app/types';
import { SyshubJobType } from 'syshub-rest-module';

@Component({
  selector: 'app-result-jobtypes',
  templateUrl: './jobtype.component.html',
  styleUrls: ['./jobtype.component.scss']
})
export class ResultJobtypeComponent implements OnInit, OnDestroy {

  @Input() searchPhrase!: string;
  @Input() searchResult!: SearchResult;
  @Input() jobtypeItems: { [key: string]: number } = {};
  @Input() jobtypeItemSorter: SyshubJobType[] = [];
  @Output() appcopy: EventEmitter<string> = new EventEmitter<string>();
  activeJobtype: SyshubJobType | null = null;
  jobtypes: SyshubJobType[] = [];
  pinned: boolean = false;
  subscription?: Subscription;

  copyToClipboard(content: string): void {
    this.appcopy.emit(content);
  }

  constructor(private i10nService: L10nService,
    private cacheService: CacheService) { }

  l10n(phrase: string, params: any[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  ngOnInit(): void {
    this.subscription = this.cacheService.jobtypes.subscribe((jobtypes) => {
      this.jobtypes = jobtypes.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
    });
  }

}
