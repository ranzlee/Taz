import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FakeEntityListComponent } from './fake-entity-list.component';
import { FakeEntityGroupComponent } from '../fake-entity-group/fake-entity-group.component';
import { FakeEntityDetailComponent } from '../fake-entity-detail/fake-entity-detail.component';
import { HttpService } from '../../../services/http/http.service';
import { EnvironmentService } from '../../../services/environment/environment.service';

describe('FakeEntityListComponent', () => {
  let component: FakeEntityListComponent;
  let fixture: ComponentFixture<FakeEntityListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientModule],
        declarations: [
          FakeEntityListComponent,
          FakeEntityGroupComponent,
          FakeEntityDetailComponent
        ],
        providers: [HttpService, EnvironmentService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
