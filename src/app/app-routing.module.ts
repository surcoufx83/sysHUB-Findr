import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { SearchComponent } from './comp/search/search.component';
import { routeGuard } from './svc/route.guard';
import { LoginComponent } from './comp/login/login.component';
import { LogoutComponent } from './comp/logout/logout.component';
import { StatsComponent } from './comp/stats/stats.component';
import { HelpComponent } from './comp/help/help.component';
import { AboutComponent } from './comp/about/about.component';
import { ResultComponent } from './comp/result/result.component';
import { WorkflowUiComponent } from './comp/workflow-ui/workflow-ui.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent, canActivate: [routeGuard] },
  { path: 'help', component: HelpComponent, canActivate: [routeGuard] },
  { path: 'login', component: LoginComponent, canActivate: [routeGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [routeGuard] },
  { path: 'result', component: ResultComponent, canActivate: [routeGuard] },
  { path: 'search', component: SearchComponent, canActivate: [routeGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [routeGuard] },
  { path: 'workflow', component: WorkflowUiComponent, canActivate: [routeGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
