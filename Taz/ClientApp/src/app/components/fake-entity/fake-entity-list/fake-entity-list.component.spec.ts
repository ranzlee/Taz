import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeEntityListComponent } from './fake-entity-list.component';

describe('FakeEntityListComponent', () => {
  let component: FakeEntityListComponent;
  let fixture: ComponentFixture<FakeEntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeEntityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
