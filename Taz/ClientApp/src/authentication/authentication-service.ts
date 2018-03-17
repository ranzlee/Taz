import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {
  constructor(private jwtHelperService: JwtHelperService) {}

  loggedIn(): boolean {
    const token: string = this.getToken();
    if (!token) {
      return false;
    }
    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
    return !tokenExpired;
  }

  decodeToken(token: string): any {
    return this.jwtHelperService.decodeToken(token);
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
