import { OnDestroy } from '@angular/core';

export interface IStoreService<T> {
  subscribe(
    subscriber: OnDestroy,
    data: any,
    callback: (observableResults: T) => void
  ): void;
  unsubscribe(subscriber: OnDestroy, callback?: () => void): void;
}
