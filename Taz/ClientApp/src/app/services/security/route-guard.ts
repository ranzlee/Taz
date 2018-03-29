import { Injectable, OnDestroy } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  CanLoad,
  Route
} from '@angular/router';
import { SecurityService } from './security-service';
import { PolicyAuthorization } from './policyAuthorization';
import * as linq from 'linq';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouteGuard implements OnDestroy, CanActivate, CanLoad {
  private policyAuthorizations: PolicyAuthorization[];

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {
    this.securityService.subscribe(this, policyAuthorizations => {
      this.policyAuthorizations = policyAuthorizations;
    });
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.isAuthorized(route.path);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.isAuthorized(route.routeConfig.path);
  }

  ngOnDestroy(): void {
    this.securityService.unsubscribe(this);
  }

  isAuthorized(routePath: string): boolean {
    if (this.securityService.loggedIn()) {
      return linq
        .from(this.policyAuthorizations)
        .where(p => p.authorized)
        .any(p => linq.from(p.routes).any(r => r === routePath));
    } else {
      this.securityService.removeToken();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
