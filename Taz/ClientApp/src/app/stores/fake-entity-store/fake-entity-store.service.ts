import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, Subscribable } from 'rxjs/Observable';
import { SubscriberMap } from '../subscriberMap';
import * as linq from 'linq';

@Injectable()
export class FakeEntityStoreService {
  private fakeEntities: BehaviorSubject<Taz.Domain.IFakeEntity[]>;
  private subscribers: SubscriberMap[] = [];

  constructor(private httpService: HttpService) {
    this.fakeEntities = new BehaviorSubject<Taz.Domain.IFakeEntity[]>(
      new Array<Taz.Domain.IFakeEntity>()
    );
  }

  subscribe(
    subscriber: any,
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
    this.subscribers.push({
      subscriber: subscriber,
      subscription: subscription
    });
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

  unsubscribe(subscriber: any) {
    linq
      .from(this.subscribers)
      .where(x => x.subscriber === subscriber)
      .first()
      .subscription.unsubscribe();
    console.log(
      'fake entity store - unsubscribed - total observers = ' +
        this.fakeEntities.observers.length
    );
    this.subscribers = linq
      .from(this.subscribers)
      .where(x => x.subscriber !== subscriber)
      .toArray();
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
