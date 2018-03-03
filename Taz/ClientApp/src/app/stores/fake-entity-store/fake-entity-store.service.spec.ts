import { TestBed, inject } from '@angular/core/testing';

import { FakeEntityStoreService } from './fake-entity-store.service';
import { HttpService } from '../../services/http/http.service';
import { EnvironmentService } from '../../services/environment/environment.service';
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
