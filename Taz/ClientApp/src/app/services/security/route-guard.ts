import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SecurityService } from './security-service';
import { PolicyAuthorization } from './policyAuthorization';

@Injectable()
export class RouteGuard implements OnDestroy, CanActivate {
  private policyAuthorizations: PolicyAuthorization[];

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {
    this.securityService.subscribe(this, policyAuthorizations => {
      this.policyAuthorizations = policyAuthorizations;
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedPolicy: Taz.Model.Security.PolicyTypeEnum;
    if (route.data && route.data.expectedPolicy) {
      expectedPolicy = route.data
        .expectedPolicy as Taz.Model.Security.PolicyTypeEnum;
    }
    if (this.securityService.loggedIn()) {
      if (expectedPolicy) {
        if (
          this.policyAuthorizations &&
          this.policyAuthorizations.length &&
          this.policyAuthorizations.length > 0
        ) {
          for (let x = 0; x < this.policyAuthorizations.length; x++) {
            if (
              this.policyAuthorizations[x].policyType === expectedPolicy &&
              this.policyAuthorizations[x].authorized
            ) {
              return true;
            }
          }
        }
        return false;
      } else {
        return true;
      }
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
