import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../services/environment/environment.service';

@Injectable()
export class HttpService {
  private http: HttpClient;
  private environmentService: EnvironmentService;

  constructor(
    http: HttpClient,
    @Inject(EnvironmentService) environmentService: EnvironmentService
  ) {
    this.http = http;
    this.environmentService = environmentService;
  }

  get<T>(api: string, callback: (result: T) => void): void {
    this.http.get<T>(this.environmentService.baseUrl + api).subscribe(
      result => {
        callback(result);
      },
      error => console.error(error)
    );
  }
}
