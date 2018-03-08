import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SubscriberHelper } from '../subscriberHelper';
import { IStoreService } from '../storeService';
import * as linq from 'linq';

@Injectable()
export class FakeEntityStoreService
  implements IStoreService<Taz.Domain.IFakeEntity[]> {
  private fakeEntities: BehaviorSubject<Taz.Domain.IFakeEntity[]>;
  private subscriberHelper = new SubscriberHelper();

  constructor(private httpService: HttpService) {
    this.fakeEntities = new BehaviorSubject<Taz.Domain.IFakeEntity[]>(
      new Array<Taz.Domain.IFakeEntity>()
    );
  }

  subscribe(
    subscriber: OnDestroy,
    parent: Taz.Domain.IFakeEntity,
    callback: (fakeEntities: Taz.Domain.IFakeEntity[]) => void
  ): void {
    const parentId = parent == null ? null : parent.id;
    const subscription = this.fakeEntities.subscribe(fakeEntities => {
      console.log(
        'fake entity store - subscribed - total observers = ' +
        this.fakeEntities.observers.length
      );
      callback(
        linq
          .from(fakeEntities)
          .where(x => x.parentId === parentId)
          .toArray()
      );
    });
    this.subscriberHelper.addSubscriber(subscriber, subscription);
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
      }
    );
  }

  unsubscribe(subscriber: OnDestroy, callback?: () => void) {
    this.subscriberHelper.removeSubscriber(subscriber);
    console.log(
      'fake entity store - unsubscribed - total observers = ' +
      this.fakeEntities.observers.length
    );
    if (callback) {
      callback();
    }
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
        this.fakeEntities.next([
          ...linq
            .from(this.fakeEntities.value)
            .where(x => x.id !== fakeEntity.id)
            .toArray()
          , result]);
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
