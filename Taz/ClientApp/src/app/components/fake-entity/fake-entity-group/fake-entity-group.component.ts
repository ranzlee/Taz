import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FakeEntityStoreService } from '../../../stores/fake-entity-store/fake-entity-store.service';

@Component({
  selector: 'app-fake-entity-group',
  templateUrl: './fake-entity-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeEntityGroupComponent implements OnInit, OnDestroy {
  @Input() parent: Taz.Model.Domain.IFakeEntity;

  fakeEntities: Taz.Model.Domain.IFakeEntity[];
  newFakeEntity: Taz.Model.Domain.IFakeEntity = {};

  constructor(
    private fakeEntityStoreService: FakeEntityStoreService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('fake enttity store - component init subscription');
    this.fakeEntityStoreService.subscribe(this, this.parent, fakeEntities => {
      this.fakeEntities = fakeEntities;
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    console.log('fake enttity store - component destroy unsubscribe');
    this.fakeEntityStoreService.unsubscribe(this);
  }

  add(): void {
    this.fakeEntityStoreService.add(this.newFakeEntity, this.parent, () => {
      this.newFakeEntity = {};
    });
  }
}
