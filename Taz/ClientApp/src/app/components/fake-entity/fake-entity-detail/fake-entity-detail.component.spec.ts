import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FakeEntityDetailComponent } from './fake-entity-detail.component';
import { FakeEntityGroupComponent } from '../fake-entity-group/fake-entity-group.component';
import { HttpService } from '../../../services/http/http.service';
import { EnvironmentService } from '../../../services/environment/environment.service';
import { FakeEntityStoreService } from '../../../services/fake-entity-store/fake-entity-store.service';

describe('FakeEntityDetailComponent', () => {
  let component: FakeEntityDetailComponent;
  let fixture: ComponentFixture<FakeEntityDetailComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientModule],
        declarations: [FakeEntityDetailComponent, FakeEntityGroupComponent],
        providers: [HttpService, EnvironmentService, FakeEntityStoreService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
