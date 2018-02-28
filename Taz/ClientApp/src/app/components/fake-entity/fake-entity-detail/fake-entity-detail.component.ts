import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { FakeEntityListComponent } from '../fake-entity-list/fake-entity-list.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-fake-entity-detail]',
  templateUrl: './fake-entity-detail.component.html',
  styleUrls: ['./fake-entity-detail.component.css']
})
export class FakeEntityDetailComponent implements OnInit {
  @Input() fakeEntity: Taz.Domain.IFakeEntity;
  @Output() removed: EventEmitter<Taz.Domain.IFakeEntity> = new EventEmitter();

  isGroupExpanded = false;
  isEditMode = false;
  tempFakeEntity: Taz.Domain.IFakeEntity = {};

  constructor(private httpService: HttpService) {}

  ngOnInit() {}

  toggleGroup(): void {
    this.isGroupExpanded = this.isGroupExpanded ? false : true;
  }

  save(): void {
    this.fakeEntity.name = this.tempFakeEntity.name;
    this.httpService.post(
      'api/FakeEntity/AddOrUpdateFakeEntity',
      this.fakeEntity,
      result => {}
    );
    this.isEditMode = false;
  }

  cancel(): void {
    this.isEditMode = false;
  }

  editMode(): void {
    this.tempFakeEntity.name = this.fakeEntity.name;
    this.isEditMode = true;
  }

  remove(): void {
    this.httpService.post(
      'api/FakeEntity/RemoveFakeEntity',
      this.fakeEntity,
      result => {
        this.removed.emit(this.fakeEntity);
      }
    );
  }
}
