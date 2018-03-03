import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { FakeEntityStoreService } from '../../../services/fake-entity-store/fake-entity-store.service';
import * as linq from 'linq';

@Component({
  selector: 'app-fake-entity-group',
  templateUrl: './fake-entity-group.component.html',
  styleUrls: ['./fake-entity-group.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeEntityGroupComponent implements OnInit {
  @Input() parent: Taz.Domain.IFakeEntity;

  fakeEntities: Taz.Domain.IFakeEntity[];
  newFakeEntity: Taz.Domain.IFakeEntity;

  constructor(private fakeEntityStoreService: FakeEntityStoreService) {
    this.newFakeEntity = {};
  }

  ngOnInit(): void {
    const parentId = this.parent == null ? null : this.parent.id;
    this.fakeEntityStoreService.fakeEntities.subscribe(fakeEntities => {
      this.fakeEntities = linq
        .from(fakeEntities)
        .where(x => x.parentId === parentId)
        .toArray();
    });
    this.fakeEntityStoreService.load(this.parent);
  }

  add(): void {
    this.fakeEntityStoreService.add(this.newFakeEntity, this.parent, () => {
      this.newFakeEntity = {};
    });
  }
}
