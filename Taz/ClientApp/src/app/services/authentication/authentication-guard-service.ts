import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication-service';
import { PolicyAuthorization } from './policyAuthorization';

@Injectable()
export class AuthenticationGuard implements OnDestroy, CanActivate {
  private policyAuthorizations: PolicyAuthorization[];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.authenticationService.subscribe(this, policyAuthorizations => {
      this.policyAuthorizations = policyAuthorizations;
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedPolicy: Taz.Model.Security.PolicyTypeEnum;
    if (route.data && route.data.expectedPolicy) {
      expectedPolicy = route.data
        .expectedPolicy as Taz.Model.Security.PolicyTypeEnum;
    }
    if (this.authenticationService.loggedIn()) {
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
      this.authenticationService.removeToken();
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  ngOnDestroy(): void {
    this.authenticationService.unsubscribe(this);
  }
}
