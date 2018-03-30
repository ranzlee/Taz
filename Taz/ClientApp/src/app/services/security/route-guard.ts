import { Injectable, OnDestroy } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  CanLoad,
  Route
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SecurityService } from './security-service';
import { PolicyAuthorization } from './policyAuthorization';
import * as linq from 'linq';

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

  private isAuthorized(routePath: string): boolean {
    if (this.securityService.loggedIn()) {
      if (routePath.startsWith('login')) {
        this.router.navigateByUrl('/');
        return false;
      }
      return linq
        .from(this.policyAuthorizations)
        .where(p => p.authorized)
        .any(p => linq.from(p.routes).any(r => r === routePath));
    } else {
      if (routePath.startsWith('login')) {
        return true;
      }
      this.securityService.removeToken();
      this.router.navigateByUrl('/login/' + routePath);
      return false;
    }
  }
}
