import { TestBed, inject } from '@angular/core/testing';

import { FakeEntityStoreService } from './fake-entity-store.service';
import { HttpService } from '../http/http.service';
import { EnvironmentService } from '../environment/environment.service';
import { HttpClientModule } from '@angular/common/http';

describe('FakeEntityStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FakeEntityStoreService, HttpService, EnvironmentService]
    });
  });

  it(
    'should be created',
    inject([FakeEntityStoreService], (service: FakeEntityStoreService) => {
      expect(service).toBeTruthy();
    })
  );
});
