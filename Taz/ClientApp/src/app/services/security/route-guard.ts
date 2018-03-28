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
    if (this.securityService.loggedIn()) {
      return linq
        .from(this.policyAuthorizations)
        .where(p => p.authorized)
        .any(p => linq.from(p.routes).any(r => r === route.path));
    } else {
      this.securityService.removeToken();
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.securityService.loggedIn()) {
      return linq
        .from(this.policyAuthorizations)
        .where(p => p.authorized)
        .any(p => linq.from(p.routes).any(r => r === route.routeConfig.path));
    } else {
      this.securityService.removeToken();
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  ngOnDestroy(): void {
    this.securityService.unsubscribe(this);
  }
}
