import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../services/environment/environment.service';

@Injectable()
export class HttpService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  get<T>(api: string, callback: (result: T) => void): void {
    this.http.get<T>(this.environmentService.baseUrl + api).subscribe(
      result => {
        callback(result);
      },
      error => console.error(error)
    );
  }

  post<T>(api: string, payload: T, callback: (result: T) => void): void {
    this.http.post<T>(this.environmentService.baseUrl + api, payload).subscribe(
      result => {
        callback(result);
      },
      error => console.error(error)
    );
  }
}
