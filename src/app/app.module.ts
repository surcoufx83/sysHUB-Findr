import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Inject, NgModule, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MarkdownModule } from 'ngx-markdown';
import { RestService, Settings, SyshubInterceptor } from 'syshub-rest-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './comp/about/about.component';
import { HelpComponent } from './comp/help/help.component';
import { HomeComponent } from './comp/home/home.component';
import { LoginComponent } from './comp/login/login.component';
import { LogoutComponent } from './comp/logout/logout.component';
import { MainComponent } from './comp/main/main.component';
import { NavbarComponent } from './comp/main/navbar/navbar.component';
import { ProgressbarComponent } from './comp/main/progressbar/progressbar.component';
import { ScopeWarningBarComponent } from './comp/main/scope-warning-bar/scope-warning-bar.component';
import { ToolbarComponent } from './comp/main/toolbar/toolbar.component';
import { NodeInspectorCertstoreNodeComponent } from './comp/node-inspector/certstore-node/certstore-node.component';
import { CopyButtonComponent } from './comp/node-inspector/common/copy-button/copy-button.component';
import { NodeInspectorCommonTableNodeComponent } from './comp/node-inspector/common/table-node/table-node.component';
import { NodeInspectorConfigNodeComponent } from './comp/node-inspector/config-node/config-node.component';
import { NodeInspectorIppdeviceNodeComponent } from './comp/node-inspector/ippdevice-node/ippdevice-node.component';
import { NodeInspectorJobtypesNodeComponent } from './comp/node-inspector/jobtypes-node/jobtypes-node.component';
import { NodeInspectorComponent } from './comp/node-inspector/node-inspector.component';
import { NodeInspectorPsetNodeComponent } from './comp/node-inspector/pset-node/pset-node.component';
import { NodeInspectorUserNodeComponent } from './comp/node-inspector/user-node/user-node.component';
import { NodeInspectorWfCelementNodeComponent } from './comp/node-inspector/wf-celement-node/wf-celement-node.component';
import { NodeInspectorWfDecisionNodeComponent } from './comp/node-inspector/wf-decision-node/wf-decision-node.component';
import { NodeInspectorWfProcessNodeComponent } from './comp/node-inspector/wf-process-node/wf-process-node.component';
import { NodeInspectorWfWorkflowNodeComponent } from './comp/node-inspector/wf-workflow-node/wf-workflow-node.component';
import { NodeInspectorWorkflowsNodeComponent } from './comp/node-inspector/workflows-node/workflows-node.component';
import { CertstoreComponent } from './comp/result/certstore/certstore.component';
import { ConfigComponent } from './comp/result/config/config.component';
import { IppdeviceComponent } from './comp/result/ippdevice/ippdevice.component';
import { JobtypesComponent } from './comp/result/jobtypes/jobtypes.component';
import { OverviewComponent } from './comp/result/overview/overview.component';
import { ParametersetComponent } from './comp/result/parameterset/parameterset.component';
import { ResultComponent } from './comp/result/result.component';
import { ServerinfoComponent } from './comp/result/serverinfo/serverinfo.component';
import { ServerpropsComponent } from './comp/result/serverprops/serverprops.component';
import { TreeComponent } from './comp/result/tree/tree.component';
import { UserComponent } from './comp/result/user/user.component';
import { WorkflowsComponent } from './comp/result/workflows/workflows.component';
import { SearchComponent } from './comp/search/search.component';
import { StatsComponent } from './comp/stats/stats.component';
import { CanvasComponent } from './comp/workflow-ui/canvas/canvas.component';
import { WorkflowUiComponent } from './comp/workflow-ui/workflow-ui.component';
import { AppInitService } from './svc/app-init.service';
import { L10nService } from './svc/i10n.service';
import { PagepropsService } from './svc/pageprops.service';
import { SearchService } from './svc/search.service';
import { ToastsService } from './svc/toasts.service';
import { ToastsComponent } from './svc/toasts/toasts.component';
import { HighlightPipe } from './utils/highlight.pipe';
import { APP_BASE_HREF } from '@angular/common';

export function initAppFactory(svc: AppInitService) {
  console.warn('initAppFactory')
  return () => svc.load();
}

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CanvasComponent,
    CertstoreComponent,
    ConfigComponent,
    CopyButtonComponent,
    HelpComponent,
    HighlightPipe,
    HomeComponent,
    IppdeviceComponent,
    JobtypesComponent,
    LoginComponent,
    LogoutComponent,
    MainComponent,
    NavbarComponent,
    NodeInspectorCertstoreNodeComponent,
    NodeInspectorCommonTableNodeComponent,
    NodeInspectorComponent,
    NodeInspectorConfigNodeComponent,
    NodeInspectorIppdeviceNodeComponent,
    NodeInspectorJobtypesNodeComponent,
    NodeInspectorPsetNodeComponent,
    NodeInspectorUserNodeComponent,
    NodeInspectorWfCelementNodeComponent,
    NodeInspectorWfDecisionNodeComponent,
    NodeInspectorWfProcessNodeComponent,
    NodeInspectorWfWorkflowNodeComponent,
    NodeInspectorWorkflowsNodeComponent,
    OverviewComponent,
    ParametersetComponent,
    ProgressbarComponent,
    ResultComponent,
    ScopeWarningBarComponent,
    SearchComponent,
    ServerinfoComponent,
    ServerpropsComponent,
    StatsComponent,
    ToastsComponent,
    ToolbarComponent,
    TreeComponent,
    UserComponent,
    WorkflowsComponent,
    WorkflowUiComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AppInitService, multi: false },
    { provide: APP_INITIALIZER, useFactory: initAppFactory, deps: [AppInitService], multi: true },
    { provide: Settings, multi: false, useFactory: (initService: AppInitService) => initService.environment?.api.syshub, deps: [AppInitService] },
    { provide: RestService, multi: false, deps: [Settings, HttpClient] },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: SyshubInterceptor, deps: [Settings, RestService] },
    { provide: L10nService, multi: false },
    { provide: SearchService, multi: false },
    { provide: PagepropsService, multi: false },
    { provide: ToastsService, multi: false },
    { provide: DeviceDetectorService, },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  /* private _donePromise: Promise<void>;
  private _done: boolean = false;
  constructor(@Inject(APP_INITIALIZER) @Optional() appInits: (() => any)[]) {
    const asyncInitPromises: Promise<any>[] = [];
    if (appInits) {
      for (let i = 0; i < appInits.length; i++) {
        const initResult = appInits[i]();
        //if (isPromise(initResult)) {
        asyncInitPromises.push(initResult);
        //}
      }
    }
    this._donePromise = Promise.all(asyncInitPromises).then(() => { this._done = true; });
    if (asyncInitPromises.length === 0) {
      this._done = true;
    }
  } */
}
