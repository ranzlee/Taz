import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import * as linq from 'linq';

@Component({
  selector: 'app-fake-entity-group',
  templateUrl: './fake-entity-group.component.html',
  styleUrls: ['./fake-entity-group.component.css']
})
export class FakeEntityGroupComponent implements OnInit {
  @Input() parent: Taz.Domain.IFakeEntity;

  fakeEntities: Taz.Domain.IFakeEntity[];
  newFakeEntity: Taz.Domain.IFakeEntity;

  constructor(private httpService: HttpService) {
    this.newFakeEntity = {};
  }

  ngOnInit(): void {
    const parentId = this.parent == null ? '0' : this.parent.id;
    this.httpService.get<Taz.Domain.IFakeEntity[]>(
      'api/FakeEntity/GetFakeEntities?parentid=' + parentId,
      result => {
        this.fakeEntities = result;
      }
    );
  }

  add(): void {
    if (this.parent != null) {
      this.newFakeEntity.parentId = this.parent.id;
      this.newFakeEntity.rootId = this.parent.rootId;
    }
    this.httpService.post<Taz.Domain.IFakeEntity>(
      'api/FakeEntity/AddOrUpdateFakeEntity',
      this.newFakeEntity,
      result => {
        this.fakeEntities.push(result);
        this.newFakeEntity = {};
      }
    );
  }

  onRemove(fakeEntity: Taz.Domain.IFakeEntity) {
    this.fakeEntities = linq
      .from(this.fakeEntities)
      .where(x => x.id !== fakeEntity.id)
      .toArray();
  }
}
