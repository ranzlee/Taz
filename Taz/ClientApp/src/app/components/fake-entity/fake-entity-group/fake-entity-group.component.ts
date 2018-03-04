import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FakeEntityStoreService } from '../../../stores/fake-entity-store/fake-entity-store.service';

@Component({
  selector: 'app-fake-entity-group',
  templateUrl: './fake-entity-group.component.html',
  styleUrls: ['./fake-entity-group.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeEntityGroupComponent implements OnInit, OnDestroy {
  @Input() parent: Taz.Domain.IFakeEntity;

  fakeEntities: Taz.Domain.IFakeEntity[];
  newFakeEntity: Taz.Domain.IFakeEntity = {};

  constructor(private fakeEntityStoreService: FakeEntityStoreService) { }

  ngOnInit(): void {
    console.log('fake enttity store - component init subscription');
    this.fakeEntityStoreService.subscribe(this, this.parent, fakeEntities => {
      this.fakeEntities = fakeEntities;
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
