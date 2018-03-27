import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PolicyAuthorization } from './policyAuthorization';
import { Observable } from 'rxjs/Observable';
import { ISubscriberService } from '../subscriberService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SubscriberHelper } from '../subscriberHelper';

@Injectable()
export class SecurityService
  implements ISubscriberService<PolicyAuthorization[]> {
  private subscriberHelper = new SubscriberHelper();
  private securityPolicies: Taz.Model.Security.IPolicyMap[] = [];
  private policyAuthorizations: BehaviorSubject<PolicyAuthorization[]>;

  constructor(
    private jwtHelperService: JwtHelperService,
    private httpClient: HttpClient
  ) {
    this.policyAuthorizations = new BehaviorSubject<PolicyAuthorization[]>(
      new Array<PolicyAuthorization>()
    );
  }

  subscribe(
    subscriber: OnDestroy,
    callback: (observableResults: PolicyAuthorization[]) => void
  ): void {
    const subscription = this.policyAuthorizations.subscribe(
      policyAuthorizations => {
        console.log(
          'security service - subscribed - total observers = ' +
            this.policyAuthorizations.observers.length
        );
        callback(policyAuthorizations);
      }
    );
    this.subscriberHelper.addSubscriber(subscriber, subscription);
    // this is for re-bootstrap on browser refresh
    this.httpClient
      .get<Taz.Model.Security.IPolicyMap[]>(
        'api/security/getsecuritypolicies',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`
          }
        }
      )
      .subscribe(
        result => {
          this.securityPolicies = result;
          this.policyAuthorizations.next(this.resolvePolicies());
        },
        (httpErrorResponse: HttpErrorResponse) => {
          if (httpErrorResponse.status === 401) {
            this.removeToken();
          }
        }
      );
  }

  unsubscribe(subscriber: OnDestroy, callback?: () => void): void {
    this.subscriberHelper.removeSubscriber(subscriber);
    console.log(
      'security service - unsubscribed - total observers = ' +
        this.policyAuthorizations.observers.length
    );
    if (callback) {
      callback();
    }
  }

  loggedIn(): boolean {
    const token: string = this.getToken();
    if (!token) {
      return false;
    }
    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
    return !tokenExpired;
  }

  decodeToken(token: string): Taz.Model.Security.IJwtToken {
    return this.jwtHelperService.decodeToken(
      token
    ) as Taz.Model.Security.IJwtToken;
  }

  getToken(): string {
    return this.jwtHelperService.tokenGetter();
  }

  addToken(token: string): void {
    // this is for login
    localStorage.setItem('access_token', token);
    this.httpClient
      .get<Taz.Model.Security.IPolicyMap[]>(
        'api/security/getsecuritypolicies',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`
          }
        }
      )
      .subscribe(result => {
        this.securityPolicies = result;
        this.policyAuthorizations.next(this.resolvePolicies());
      });
  }

  removeToken(): void {
    // this is for logout
    localStorage.removeItem('access_token');
    this.httpClient
      .get<Taz.Model.Security.IPolicyMap[]>('api/security/getsecuritypolicies')
      .subscribe(result => {
        this.securityPolicies = result;
        this.policyAuthorizations.next(this.resolvePolicies());
      });
  }

  private resolvePolicies(): PolicyAuthorization[] {
    const t = this.decodeToken(this.jwtHelperService.tokenGetter());
    const results: PolicyAuthorization[] = [];
    this.securityPolicies.forEach(securityPolicy => {
      if (!this.loggedIn()) {
        results.push({
          policyType: securityPolicy.policyType,
          policyName: securityPolicy.policyName,
          authorized: false
        });
      } else {
        let isAuthorized = false;
        if (Array.isArray(t.rol)) {
          securityPolicy.roles.forEach(role => {
            if ((t.rol as Array<string>).find(x => x === role) != null) {
              isAuthorized = true;
            }
          });
        } else {
          if (
            securityPolicy.roles.length === 1 &&
            t.rol === securityPolicy.roles[0]
          ) {
            isAuthorized = true;
          }
        }
        results.push({
          policyType: securityPolicy.policyType,
          policyName: securityPolicy.policyName,
          authorized: isAuthorized
        });
      }
    });
    return results;
  }
}
