import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FakeEntityGroupComponent } from './fake-entity-group.component';
import { FakeEntityDetailComponent } from '../fake-entity-detail/fake-entity-detail.component';
import { HttpService } from '../../../services/http/http.service';
import { EnvironmentService } from '../../../services/environment/environment.service';
import { FakeEntityStoreService } from '../../../services/fake-entity-store/fake-entity-store.service';

describe('FakeEntityGroupComponent', () => {
  let component: FakeEntityGroupComponent;
  let fixture: ComponentFixture<FakeEntityGroupComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientModule],
        declarations: [FakeEntityGroupComponent, FakeEntityDetailComponent],
        providers: [HttpService, EnvironmentService, FakeEntityStoreService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
