import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtHelperService: JwtHelperService,
    private httpClient: HttpClient
  ) {
    this.httpClient
      .get<Taz.Model.View.Security.ISecurityPolicy[]>(
        'api/account/getsecuritypolicies'
      )
      .subscribe(result => {
        this.securityPolicies = result;
      });
  }

  private securityPolicies: Taz.Model.View.Security.ISecurityPolicy[] = [];

  loggedIn(): boolean {
    const token: string = this.getToken();
    if (!token) {
      return false;
    }
    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
    return !tokenExpired;
  }

  decodeToken(token: string): Taz.Model.View.Security.IJwtToken {
    return this.jwtHelperService.decodeToken(
      token
    ) as Taz.Model.View.Security.IJwtToken;
  }

  hasPolicy(
    policy: string | string[],
    allOrAnyMatches: 'all' | 'any' = 'all'
  ): boolean {
    if (!this.loggedIn()) {
      return false;
    }
    if (Array.isArray(policy)) {
      if (allOrAnyMatches === 'all') {
        policy.forEach(p => {
          if (!this.isAuthorized(p)) {
            return false;
          }
          return true;
        });
      } else {
        policy.forEach(p => {
          if (this.isAuthorized(p)) {
            return true;
          }
          return false;
        });
      }
    } else {
      return this.isAuthorized(policy);
    }
  }

  private isAuthorized(policy: string): boolean {
    const sec = this.securityPolicies.find(x => x.name === policy);
    if (sec === undefined) {
      return false;
    }
    const t = this.decodeToken(this.jwtHelperService.tokenGetter());
    if (Array.isArray(t.rol)) {
      sec.roles.forEach(role => {
        const r = (t.rol as Array<string>).find(x => x === role);
        if (r === undefined) {
          return false;
        }
      });
    } else {
      if (sec.roles.length !== 1) {
        return false;
      }
      if (t.rol !== sec.roles[0]) {
        return false;
      }
    }
    return true;
  }

  getToken(): string {
    return this.jwtHelperService.tokenGetter();
  }

  addToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
  }
}
