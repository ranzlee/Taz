import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FakeEntityStoreService } from '../../../stores/fake-entity-store/fake-entity-store.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-fake-entity-detail]',
  templateUrl: './fake-entity-detail.component.html',
  styleUrls: ['./fake-entity-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeEntityDetailComponent {

  @Input() fakeEntity: Taz.Domain.IFakeEntity;

  isGroupExpanded = false;
  isEditMode = false;
  tempFakeEntity: Taz.Domain.IFakeEntity = {};

  constructor(private fakeEntityStoreService: FakeEntityStoreService) { }

  toggleGroup(): void {
    this.isGroupExpanded = !this.isGroupExpanded;
  }

  save(): void {
    this.fakeEntity.name = this.tempFakeEntity.name;
    this.fakeEntityStoreService.update(this.fakeEntity, () => {
      this.isEditMode = false;
    });
  }

  cancel(): void {
    this.isEditMode = false;
  }

  editMode(): void {
    this.tempFakeEntity.name = this.fakeEntity.name;
    this.isEditMode = true;
  }

  remove(): void {
    this.fakeEntityStoreService.remove(this.fakeEntity);
  }
}
