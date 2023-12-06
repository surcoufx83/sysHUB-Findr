import { APP_BASE_HREF } from '@angular/common';
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
import { NavbarComponent } from './comp/common/navbar/navbar.component';
import { ResultConfigComponent } from './comp/result/config/config.component';
import { ResultHomeComponent } from './comp/result/home/home.component';
import { ResultJobtypeComponent } from './comp/result/jobtype/jobtype.component';
import { ResultParametersetComponent } from './comp/result/parameterset/parameterset.component';
import { PropertyTableItemComponent } from './comp/result/property-table-item/property-table-item.component';
import { ResultComponent } from './comp/result/result.component';
import { ResultWorkflowComponent } from './comp/result/workflow/workflow.component';
import { SearchComponent } from './comp/search/search.component';
import { ToolbarComponent } from './comp/common/toolbar/toolbar.component';
import { L10nService } from './svc/i10n.service';
import { PagepropsService } from './svc/pageprops.service';
import { SearchService } from './svc/search.service';
import { HighlightPipe } from './utils/highlight.pipe';
import { ToastsService } from './svc/toasts.service';
import { ToastsComponent } from './svc/toasts/toasts.component';
import { LoginComponent } from './comp/login/login.component';
import { LogoutComponent } from './comp/logout/logout.component';
import { MainComponent } from './comp/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    HomeComponent,
    ToolbarComponent,
    ResultComponent,
    ResultConfigComponent,
    ResultHomeComponent,
    HighlightPipe,
    PropertyTableItemComponent,
    ResultParametersetComponent,
    ResultJobtypeComponent,
    ResultWorkflowComponent,
    ToastsComponent,
    LoginComponent,
    LogoutComponent,
    MainComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
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
    { provide: APP_BASE_HREF, useValue: '/findr' },
    { provide: L10nService, multi: false },
    { provide: SearchService, multi: false },
    { provide: PagepropsService, multi: false },
    { provide: ToastsService, multi: false },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
