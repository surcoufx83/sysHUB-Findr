import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppInitService } from 'src/app/svc/app-init.service';
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

  displayUnusedBadges: boolean = true;
  nodesToggled: string[] = [];
  @Input({ required: true }) searchResult!: SearchResult;
  @Input({ required: true }) showUnmatchedItems!: boolean;
  workflows: SyshubWorkflow[] = [];
  workflowsMatched: string[] = [];
  workflowsUpdated: number | null = null;
  workflowsUnused: string[] = [];
  workflowRefs: { [key: string]: number } = {};

  subs: Subscription[] = [];

  constructor(private l10nService: L10nService,
    private cacheService: CacheService,
    private propsService: PagepropsService,
    appInitService: AppInitService) {
    if (appInitService.environment.app?.unusedWorkflowBadge === false)
      this.displayUnusedBadges = false;
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
    this.subs.push(this.cacheService.WorkflowsUpdated.subscribe((timestamp) => {
      if (timestamp === this.workflowsUpdated)
        return;
      this.workflows = [...this.cacheService.getWorkflows()];
      this.workflowsUpdated = timestamp;
    }));
    if (this.displayUnusedBadges)
      this.subs.push(this.cacheService.workflowReferencesUpdated.subscribe(() => this.workflowsUnused = [...this.cacheService.workflowsWithoutReferences()]));
    this.searchResult.result?.workflows.forEach((item) => this.workflowsMatched.push(item.uuid));
    this.subs.push(this.propsService.NodesClosed.subscribe((request) => {
      if (request[1] === true && 'uuid' in request[0].node && this.nodesToggled.includes(request[0].node.uuid)) {
        // Handle X-press in tooltip manually
        this.nodesToggled.splice(this.nodesToggled.indexOf(request[0].node.uuid, 1));
      }
    }));
  }

  hoverNode(node: SyshubWorkflow, event: MouseEvent): void {
    this.propsService.inspect('WorkflowItems', node, 'show', {
      top: event.pageY - 74,
      left: event.pageX + 86,
    });
  }

  leaveNode(node: SyshubWorkflow): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.propsService.inspect('WorkflowItems', node, 'remove');
  }

  selectNode(node: SyshubWorkflow): void {
    if (!this.nodesToggled.includes(node.uuid))
      this.nodesToggled.push(node.uuid);
    else
      this.nodesToggled.splice(this.nodesToggled.indexOf(node.uuid, 1));
  }
}
