import { OnDestroy } from '@angular/core';
import { ISubscriberMap } from './subscriberMap';
import { Subscription } from 'rxjs/Subscription';
import * as linq from 'linq';

export class SubscriberHelper {
  private subscribers: ISubscriberMap[] = [];

  constructor() {}

  addSubscriber(subscriber: OnDestroy, subscription: Subscription) {
    this.subscribers.push({
      subscriber: subscriber,
      subscription: subscription
    });
  }

  removeSubscriber(subscriber: OnDestroy) {
    const subscriberMap = linq
      .from(this.subscribers)
      .where(x => x.subscriber === subscriber)
      .firstOrDefault();
    if (subscriberMap == null) {
      return;
    }
    subscriberMap.subscription.unsubscribe();
    this.subscribers = linq
      .from(this.subscribers)
      .where(x => x.subscriber !== subscriber)
      .toArray();
  }
}
