import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeEntityDetailComponent } from './fake-entity-detail.component';

describe('FakeEntityDetailComponent', () => {
  let component: FakeEntityDetailComponent;
  let fixture: ComponentFixture<FakeEntityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeEntityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
