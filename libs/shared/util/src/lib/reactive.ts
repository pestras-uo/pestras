/* eslint-disable @typescript-eslint/no-explicit-any */
import { DestroyRef, inject } from "@angular/core";
import { BehaviorSubject, Observable, Subject, distinctUntilChanged, filter, switchMap, takeUntil } from "rxjs";

export function gate<T>(state: BehaviorSubject<boolean> | Observable<boolean>, inverse = false) {
  return (source: Observable<T>) => {
    return state
      .pipe(
        filter(val => inverse ? !val : val),
        distinctUntilChanged(),
        switchMap(() => source)
      );
  }
}

export function Unsubscriber(constructor: any) {
  // get reference to the original ngOnDestory method
  const original = constructor.prototype.ngOnDestory;

  // override ngOnDestroy method of the compoenent
  constructor.prototype.ngOnDestory = function (...args: any[]) {
    // loop all props of the component
    for (const propName in this) {
      const prop = this[propName];
      // check if prop is a subscribtion
      if (prop && typeof prop.unsubscribe === 'function')
        // call unsubscribe method
        prop.unsubscribe();
    }

    // call original ngOnDestory
    original?.apply(this, args);
  }
}

export function untilDestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return <T>() => takeUntil<T>(subject.asObservable());
}