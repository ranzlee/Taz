import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecurityService } from '../../services/security/security-service';
import { PolicyAuthorization } from '../../services/security/policyAuthorization';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isAuthenticatedUser = false;
  isAdministrator = false;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.securityService.subscribe(this, policyAuthorizations => {
      this.isAdministrator = false;
      this.isAuthenticatedUser = false;
      policyAuthorizations.forEach(policyAuthorization => {
        switch (policyAuthorization.policyType as number) {
          case Taz.Model.Security.PolicyTypeEnum.Administrator:
            this.isAdministrator = policyAuthorization.authorized;
            break;
          case Taz.Model.Security.PolicyTypeEnum.AuthenticatedUser:
            this.isAuthenticatedUser = policyAuthorization.authorized;
            break;
          default:
            break;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.securityService.unsubscribe(this);
  }
}
