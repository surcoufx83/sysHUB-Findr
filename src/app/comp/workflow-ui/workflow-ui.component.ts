import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchService } from 'src/app/svc/search.service';
import { ToastsService } from 'src/app/svc/toasts.service';
import { SearchResult } from 'src/app/types';
import { RestService, SyshubWorkflow, SyshubWorkflowModel, SyshubWorkflowReference, SyshubWorkflowVersion } from 'syshub-rest-module';

@Component({
  selector: 'app-workflow-ui',
  templateUrl: './workflow-ui.component.html',
  styleUrl: './workflow-ui.component.scss'
})
export class WorkflowUiComponent implements OnDestroy, OnInit {

  failedState: 'noUuid' | 'noCache' | 'apiError' | null = null;
  apiError?: Error;

  loaded: boolean = false;
  progress: number = 0;
  searchResult?: SearchResult;

  subs: Subscription[] = [];

  workflow?: SyshubWorkflow;
  model?: SyshubWorkflowModel;
  references?: SyshubWorkflowReference[];
  startpoints?: string[];
  versions?: SyshubWorkflowVersion[];
  workflowUuid?: string;

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private toastsService: ToastsService,
    private restapi: RestService,
  ) { }

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

  debounce: any;
  ngOnInit(): void {
    this.subs.push(this.cacheService.searchresult.subscribe((result) => this.searchResult = result ?? undefined));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      if (!map.has('uuid')) {
        this.failedState = 'noUuid';
        this.toastsService.addDangerToast({ message: this.l10nphrase.workflowUi.failedCommon + this.l10nphrase.workflowUi.failed.noUuid, autohide: false });
        return;
      }
      if (map.has('t')) {
        this.cacheService.loadSearchResult(map.get('t')!);
      }
      this.workflowUuid = map.get('uuid') ?? undefined;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.ngOnInit_LoadWf()
      }, 100);
    }));
    this.cacheService.WorkflowsUpdated.subscribe(() => {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.ngOnInit_LoadWf()
      }, 100);
    });
    this.subs.push(this.searchService.searchBusy.subscribe((state) => this.loaded = this.progress === 100 && this.workflow !== undefined));
  }

  ngOnInit_LoadWf(): void {
    if (this.workflowUuid == undefined)
      return;
    const tempworkflow = this.cacheService.getWorkflow(this.workflowUuid);
    if (tempworkflow == null)
      return;
    if (this.workflow != undefined && JSON.stringify(this.workflow) === JSON.stringify(tempworkflow))
      return;

    this.ngOnInit_ReportProgress();
    this.workflow = { ...tempworkflow };

    this.subs.push(this.restapi.getWorkflowReferences(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.references = reply;
        this.ngOnInit_ReportProgress();
      }
    }));

    this.subs.push(this.restapi.getWorkflowModel(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.model = reply;
        this.ngOnInit_ReportProgress();
      }
    }));

    this.subs.push(this.restapi.getWorkflowStartpoints(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.startpoints = reply;
        this.ngOnInit_ReportProgress();
      }
    }));

    this.subs.push(this.restapi.getWorkflowVersions(tempworkflow.uuid).subscribe((reply) => {
      if (reply instanceof Error) {
        this.toastsService.addDangerToast({
          message: this.l10n(this.l10nphrase.api.errorCommon, [reply.message]),
          autohide: false
        });
        this.failedState = 'apiError';
        this.apiError = { ...reply };
      }
      else {
        this.versions = reply;
        this.ngOnInit_ReportProgress();
      }
    }));
  }

  private ngOnInit_ReportProgress(): void {
    this.progress = ((this.workflow != undefined ? 1 : 0) +
      (this.versions != undefined ? 1 : 0) +
      (this.references != undefined ? 1 : 0) +
      (this.startpoints != undefined ? 1 : 0) +
      (this.model != undefined ? 1 : 0)) * 20;
    this.searchService.setProgress(this.progress);
  }

}
