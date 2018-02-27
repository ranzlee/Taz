import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeEntityGroupComponent } from './fake-entity-group.component';

describe('FakeEntityGroupComponent', () => {
  let component: FakeEntityGroupComponent;
  let fixture: ComponentFixture<FakeEntityGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeEntityGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeEntityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
