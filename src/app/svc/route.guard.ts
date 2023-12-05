import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { RestService } from 'syshub-rest-module';

export const routeGuard: CanActivateFn = (route, state) => {
  const loggedin = inject(RestService).getIsLoggedIn();
  let router = inject(Router);
  if (loggedin) {
    return state.url !== '/login' ? true : router.createUrlTree(['/']);
  } else {
    return state.url === '/login' ? true : router.createUrlTree(['/login']);
  }
};
