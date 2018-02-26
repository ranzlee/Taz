import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { HttpService } from './http.service';
import { EnvironmentService } from '../environment/environment.service';

describe('HttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpService, EnvironmentService]
    });
  });

  it(
    'should be created',
    inject([HttpService], (service: HttpService) => {
      expect(service).toBeTruthy();
    })
  );
});
