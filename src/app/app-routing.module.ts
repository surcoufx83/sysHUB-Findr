import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { SearchComponent } from './comp/search/search.component';
import { ResultComponent } from './comp/result/result.component';
import { ResultHomeComponent } from './comp/result/home/home.component';
import { ResultParametersetComponent } from './comp/result/parameterset/parameterset.component';
import { routeGuard } from './svc/route.guard';
import { LoginComponent } from './comp/login/login.component';
import { LogoutComponent } from './comp/logout/logout.component';

const routes: Routes = [
  {
    path: 'result', component: ResultComponent, canActivate: [routeGuard], canActivateChild: [routeGuard], children: [
      {
        path: 'config', component: ResultHomeComponent, children: [
          { path: 'workflow/:uuid', component: ResultHomeComponent }
        ]
      },
      { path: 'home', component: ResultHomeComponent },
      { path: 'jobtypes', component: ResultHomeComponent },
      {
        path: 'parameterset', component: ResultParametersetComponent, children: [
          { path: 'workflow/:uuid', component: ResultHomeComponent }
        ]
      },
      { path: 'workflows', component: ResultHomeComponent },
      { path: 'workflow/:uuid', component: ResultHomeComponent },
      { path: '', component: ResultComponent }
    ]
  },
  { path: 'login', component: LoginComponent, canActivate: [routeGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [routeGuard] },
  { path: 'search', component: SearchComponent, canActivate: [routeGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
