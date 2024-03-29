import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { SearchResult } from 'src/app/types';
import { SyshubJobType, SyshubWorkflow } from 'syshub-rest-module';

@Component({
  selector: 'app-node-inspector-jobtypes-node',
  templateUrl: './jobtypes-node.component.html',
  styleUrl: './jobtypes-node.component.scss'
})
export class NodeInspectorJobtypesNodeComponent implements OnDestroy, OnInit {

  @Input({ required: true }) nodeItem!: SyshubJobType;
  @Output() onChangeColor = new EventEmitter<never>();
  @Input({ required: true }) searchResult?: SearchResult;

  classifiedWorkflow: SyshubWorkflow | null = null;
  processingWorkflow: SyshubWorkflow | null = null;

  hidePercentItems = false;
  showClassificationGroup = true;
  showJobAttributesGroup = true;
  showProcessingGroup = true;
  showWorkflowsGroup = true;
  subs: Subscription[] = [];

  constructor(
    private l10nService: L10nService,
    private cacheService: CacheService,
  ) { }

  isempty(value: string | number | null | undefined): boolean {
    return value === undefined || value === null || value === '' || value === '%';
  }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.cacheService.userconfig.subscribe((cfg) => {
      this.hidePercentItems = cfg.hideJobtypePercentItems || false;
    }));
    if (this.nodeItem.settings.classifiedworkflowuuid.value !== null)
      this.classifiedWorkflow = this.cacheService.getWorkflow(`${this.nodeItem.settings.classifiedworkflowuuid.value}`);
    if (this.nodeItem.settings.workflowuuid.value !== null)
      this.processingWorkflow = this.cacheService.getWorkflow(`${this.nodeItem.settings.workflowuuid.value}`);
  }

  togglePercentItems(): void {
    this.cacheService.toggleJobtypePropertyFilter(!this.hidePercentItems);
  }

}
