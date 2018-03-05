import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export interface ISubscriberMap {
  subscriber: OnDestroy;
  subscription: Subscription;
}
