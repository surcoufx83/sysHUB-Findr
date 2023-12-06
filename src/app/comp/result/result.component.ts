import { Component, OnDestroy, OnInit } from '@angular/core';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/svc/cache.service';
import { L10nService } from 'src/app/svc/i10n.service';
import { SearchResult } from 'src/app/types';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {

  url: string = '';
  searchResult: SearchResult | null = null;
  configItems: { [key: string]: number } = {};
  //configItemSorter: SyshubConfig[] = [];
  jobtypeItems: { [key: string]: number } = {};
  //jobtypeItemSorter: SyshubJobtype[] = [];
  //jobtypeAttributesMatched: { [key: string]: SyshubNameValueItem[] } = {};
  //jobtypeCustomAttributesMatched: { [key: string]: SyshubNameValueItem[] } = {};
  parametersetItems: { [key: string]: number } = {};
  //parametersetItemSorter: SyshubParameterset[] = [];
  workflowItems: { [key: string]: number } = {};
  //workflowItemSorter: SyshubWorkflow[] = [];
  private searchPhrasePattern: RegExp | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private i10nService: L10nService,
    private router: Router,
    private route: ActivatedRoute,
    private cacheService: CacheService,
    /* private snackBar: MatSnackBar */) { }

  copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
    //this.snackBar.open(this.i10n('common.clipboard.confirm'), this.i10n('common.phrases.okUc'), { duration: 2500 });
  }

  l10n(phrase: string, params: string[] = []) {
    return this.i10nService.ln(phrase, params);
  }

  matchPhrase(value: string | number | null): boolean {
    if (value == null)
      return false;
    if (!this.searchPhrasePattern)
      this.searchPhrasePattern = new RegExp(this.searchResult!.search.phrase, 'gi');
    return ('' + value).match(this.searchPhrasePattern) != null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    }));
    this.subscriptions.push(this.cacheService.searchresult.subscribe((result) => {
      this.searchResult = result;
      this.initConfigItems();
      this.initParametersetItems();
      this.initJobtypeItems();
      this.initWorkflowItems();
      if (result == null)
        this.router.navigate(['/']);
      else {
        this.router.navigate(['/result', 'home']);
      }
    }));
  }

  initConfigItems(): void {
    /* this.subscriptions.push(
      this.cacheService.config.subscribe((config) => {
        this.configItems = {};
        this.configItemSorter = [];
        let tempConfigItemSorter: SyshubConfig[] = [];
        if (this.searchResult == undefined || this.searchResult.result == undefined)
          return;
        this.searchResult!.result!.config.forEach((config) => {
          let item = this.cacheService.getConfigItem(config.uuid);
          if (item != null)
            tempConfigItemSorter.push(item);
        });
        this.configItemSorter = tempConfigItemSorter.sort((a, b) => a.path.toLocaleLowerCase() > b.path.toLocaleLowerCase() ? 1 : -1);
        this.configItemSorter.forEach((obj, i) => this.configItems[obj.uuid] = i);
      })
    ); */
  }

  initJobtypeItems(): void {
    /* this.subscriptions.push(
      this.cacheService.jobtypes.subscribe((jobtypes) => {
        this.jobtypeItems = {};
        this.jobtypeItemSorter = [];
        this.jobtypeAttributesMatched = {};
        this.jobtypeCustomAttributesMatched = {};
        let tempJobtypeItemSorter: SyshubJobtype[] = [];
        if (this.searchResult == undefined || this.searchResult.result == undefined)
          return;
        this.searchResult!.result!.jobtypes.forEach((jobtype) => {
          let item = this.cacheService.getJobtype(jobtype.uuid);
          if (item != null) {
            tempJobtypeItemSorter.push(item);
            this.jobtypeAttributesMatched[item.uuid] = [];
            this.jobtypeCustomAttributesMatched[item.uuid] = [];
            Object.entries(item.settings).forEach((keyvalue) => {
              if (jobtypeAttributes.includes(keyvalue[0]) && this.matchPhrase(keyvalue[1].value)) {
                this.jobtypeAttributesMatched[item!.uuid].push(<SyshubNameValueItem>{ name: keyvalue[0], value: keyvalue[1].value });
              }
            });
            if (item.settings.PropChildren) {
              item.settings.PropChildren.forEach((queue) => {
                if (this.matchPhrase(queue.name) || this.matchPhrase(queue.value))
                  this.jobtypeCustomAttributesMatched[item!.uuid].push(queue);
              });
            }
          }
        });
        this.jobtypeItemSorter = tempJobtypeItemSorter.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
        this.jobtypeItemSorter.forEach((obj, i) => this.jobtypeItems[obj.uuid] = i);
      })); */
  }

  initParametersetItems(): void {
    /* this.subscriptions.push(
      this.cacheService.parameterset.subscribe((parametersets) => {
        this.parametersetItems = {};
        this.parametersetItemSorter = [];
        let tempParametersetItemSorter: SyshubParameterset[] = [];
        if (this.searchResult == undefined || this.searchResult.result == undefined)
          return;
        this.searchResult!.result!.parameterset.forEach((parameterset) => {
          let item = this.cacheService.getParametersetItem(parameterset.uuid);
          if (item != null)
            tempParametersetItemSorter.push(item);
        });
        this.parametersetItemSorter = tempParametersetItemSorter.sort((a, b) => a.path.toLocaleLowerCase() > b.path.toLocaleLowerCase() ? 1 : -1);
        this.parametersetItemSorter.forEach((obj, i) => this.parametersetItems[obj.uuid] = i);
      })); */
  }

  initWorkflowItems(): void {
    /* this.subscriptions.push(
      this.cacheService.workflows.subscribe((workflows) => {
        this.workflowItems = {};
        this.workflowItemSorter = [];
        let tempWorkflowItemSorter: SyshubWorkflow[] = [];
        if (this.searchResult == undefined || this.searchResult.result == undefined)
          return;
        this.searchResult!.result!.workflows.forEach((workflow) => {
          let item = this.cacheService.getWorkflow(workflow.uuid);
          if (item != null)
            tempWorkflowItemSorter.push(item);
        });
        this.workflowItemSorter = tempWorkflowItemSorter.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
        this.workflowItemSorter.forEach((obj, i) => this.workflowItems[obj.uuid] = i);
      })); */
  }

}

const jobtypeAttributes: string[] = [
  'datatype', 'inputchannel', 'senderhost', 'sourcefile', 'textstatus', 'ticketfile', 'title', 'username',
  'xid', 'deldays', 'initialtextstatus', 'priority', 'starttype', 'userkey', 'classifiedworkflowuuid',
  'workflowuuid'
];
