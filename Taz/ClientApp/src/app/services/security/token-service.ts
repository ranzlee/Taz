import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  constructor() {}

  tokenGetter(): string {
    return localStorage.getItem('access_token');
  }
}
