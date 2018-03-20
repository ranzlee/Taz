import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { EnvironmentService } from '../../services/environment/environment.service';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { Router } from '@angular/router';

@Injectable()
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  get<TResult>(
    api: string,
    callback: (result: TResult) => void,
    modelStateErrorCallback?: (errors: string) => void
  ): void {
    this.httpClient
      .get<TResult>(this.environmentService.baseUrl + api, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authenticationService.getToken()}`
        }
      })
      .subscribe(
        result => {
          callback(result);
        },
        (error: HttpErrorResponse) => {
          const errors = this.handleError(error);
          if (modelStateErrorCallback) {
            modelStateErrorCallback(errors);
          }
        }
      );
  }

  post<TPayload, TResult>(
    api: string,
    payload: TPayload,
    callback: (result: TResult) => void,
    modelStateErrorCallback?: (errors: string) => void
  ): void {
    this.httpClient
      .post<TResult>(this.environmentService.baseUrl + api, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authenticationService.getToken()}`
        }
      })
      .subscribe(
        result => {
          callback(result);
        },
        (error: HttpErrorResponse) => {
          const errors = this.handleError(error);
          if (modelStateErrorCallback) {
            modelStateErrorCallback(errors);
          }
        }
      );
  }

  private handleError(httpErrorResponse: HttpErrorResponse): string {
    const applicationError = httpErrorResponse.headers.get('Application-Error');
    if (applicationError) {
      throw applicationError;
    }
    let modelStateErrors = '';
    if (httpErrorResponse.status === 400) {
      for (const key in httpErrorResponse.error) {
        if (httpErrorResponse.error[key]) {
          modelStateErrors += httpErrorResponse.error[key] + '\n';
        }
      }
    }
    if (httpErrorResponse.status === 401) {
      // this.authenticationService.removeToken();
      this.router.navigateByUrl('/');
    }
    if (httpErrorResponse.status === 403) {
      this.router.navigateByUrl('/not-authorized');
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    console.error(modelStateErrors || 'Server error');
    if (modelStateErrors) {
      return modelStateErrors;
    }
  }
}
