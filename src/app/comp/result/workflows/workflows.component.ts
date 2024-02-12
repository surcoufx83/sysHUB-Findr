import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { PagepropsService } from 'src/app/svc/pageprops.service';
import { SearchResult } from 'src/app/types';
import { SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-result-workflows',
  templateUrl: './workflows.component.html',
  styleUrl: './workflows.component.scss'
})
export class WorkflowsComponent implements OnDestroy, OnInit {

  @Input({ required: true }) searchResult!: SearchResult;
  workflows: SyshubWorkflow[] = [];
  workflowsMatched: string[] = [];
  workflowsUpdated: number | null = null;

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,) { }

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
    this.subs.push(this.cacheService.WorkflowsUpdated.subscribe((timestamp) => {
      if (timestamp === this.workflowsUpdated)
        return;
      this.workflows = [...this.cacheService.getWorkflows()];
      this.workflowsUpdated = timestamp;
    }));
    this.searchResult.result?.workflows.forEach((item) => this.workflowsMatched.push(item.uuid));
  }

  selectNode(node: SyshubWorkflow): void {
    this.propsService.inspect('WorkflowItems', node);
  }
}
