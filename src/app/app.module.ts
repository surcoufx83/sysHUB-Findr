import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { RestService, RestSettings, Settings, SyshubInterceptor } from 'syshub-rest-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './comp/home/home.component';
import { NavbarComponent } from './comp/main/navbar/navbar.component';
import { SearchComponent } from './comp/search/search.component';
import { ToolbarComponent } from './comp/main/toolbar/toolbar.component';
import { L10nService } from './svc/i10n.service';
import { PagepropsService } from './svc/pageprops.service';
import { SearchService } from './svc/search.service';
import { HighlightPipe } from './utils/highlight.pipe';
import { ToastsService } from './svc/toasts.service';
import { ToastsComponent } from './svc/toasts/toasts.component';
import { LoginComponent } from './comp/login/login.component';
import { LogoutComponent } from './comp/logout/logout.component';
import { MainComponent } from './comp/main/main.component';
import { StatsComponent } from './comp/stats/stats.component';
import { HelpComponent } from './comp/help/help.component';
import { AboutComponent } from './comp/about/about.component';
import { ProgressbarComponent } from './comp/main/progressbar/progressbar.component';
import { ResultComponent } from './comp/result/result.component';
import { OverviewComponent } from './comp/result/overview/overview.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigComponent } from './comp/result/config/config.component';
import { TreeComponent } from './comp/result/tree/tree.component';
import { ParametersetComponent } from './comp/result/parameterset/parameterset.component';
import { JobtypesComponent } from './comp/result/jobtypes/jobtypes.component';
import { NodeInspectorComponent } from './comp/node-inspector/node-inspector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NodeInspectorConfigNodeComponent } from './comp/node-inspector/config-node/config-node.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    HomeComponent,
    ToolbarComponent,
    HighlightPipe,
    ToastsComponent,
    LoginComponent,
    LogoutComponent,
    MainComponent,
    StatsComponent,
    HelpComponent,
    AboutComponent,
    ProgressbarComponent,
    ResultComponent,
    OverviewComponent,
    ConfigComponent,
    TreeComponent,
    ParametersetComponent,
    JobtypesComponent,
    NodeInspectorComponent,
    NodeInspectorConfigNodeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
  ],
  providers: [
    { provide: Settings, multi: false, useValue: new Settings(<RestSettings>(environment.api.syshub)) },
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
export class AppModule { }
