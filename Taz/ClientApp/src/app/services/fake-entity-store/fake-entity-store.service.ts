import { Injectable, Inject } from '@angular/core';
import { HttpService } from '../http/http.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as linq from 'linq';

@Injectable()
export class FakeEntityStoreService {
  fakeEntities: BehaviorSubject<Taz.Domain.IFakeEntity[]>;
  readonly loadedRootIdMap: number[];

  constructor(@Inject(HttpService) private httpService: HttpService) {
    this.fakeEntities = new BehaviorSubject<Taz.Domain.IFakeEntity[]>(
      new Array<Taz.Domain.IFakeEntity>()
    );
    this.loadedRootIdMap = [];
  }

  load(parent: Taz.Domain.IFakeEntity, callback?: () => void): void {
    const parentId = parent == null ? 0 : parent.id;
    if (linq.from(this.loadedRootIdMap).any(x => x === parentId)) {
      return;
    }
    this.loadedRootIdMap.push(parentId);
    this.httpService.get<Taz.Domain.IFakeEntity[]>(
      'api/FakeEntity/GetFakeEntities?parentid=' + parentId,
      result => {
        this.fakeEntities.next([
          ...linq
            .from(this.fakeEntities.value)
            .where(x => x.parentId !== parentId)
            .toArray(),
          ...result
        ]);
        if (callback) {
          callback();
        }
      }
    );
  }

  add(
    fakeEntity: Taz.Domain.IFakeEntity,
    parent: Taz.Domain.IFakeEntity,
    callback?: () => void
  ): void {
    if (parent != null) {
      fakeEntity.parentId = parent.id;
      fakeEntity.rootId = parent.rootId;
    }
    this.httpService.post<Taz.Domain.IFakeEntity>(
      'api/FakeEntity/AddOrUpdateFakeEntity',
      fakeEntity,
      result => {
        this.fakeEntities.next([...this.fakeEntities.value, result]);
        if (callback) {
          callback();
        }
      }
    );
  }

  update(fakeEntity: Taz.Domain.IFakeEntity, callback?: () => void) {
    this.httpService.post(
      'api/FakeEntity/AddOrUpdateFakeEntity',
      fakeEntity,
      result => {
        if (callback) {
          callback();
        }
      }
    );
  }

  remove(fakeEntity: Taz.Domain.IFakeEntity, callback?: () => void) {
    this.httpService.post(
      'api/FakeEntity/RemoveFakeEntity',
      fakeEntity,
      result => {
        this.fakeEntities.next([
          ...linq
            .from(this.fakeEntities.value)
            .where(x => x.id !== fakeEntity.id)
            .toArray()
        ]);
        if (callback) {
          callback();
        }
      }
    );
  }
}
