import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication-service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  constructor(private authenticationService: AuthenticationService) {}

  hasPolicy(policy: string): boolean {
    return this.authenticationService.hasPolicy(policy);
  }
}
