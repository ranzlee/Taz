import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-fake-entity-detail]',
  templateUrl: './fake-entity-detail.component.html',
  styleUrls: ['./fake-entity-detail.component.css']
})
export class FakeEntityDetailComponent implements OnInit {
  @Input() fakeEntity: Taz.Domain.IFakeEntity;

  public isGroupExpanded = false;

  constructor() {}

  ngOnInit() {}

  toggleGroup(): void {
    this.isGroupExpanded = this.isGroupExpanded ? false : true;
  }
}
