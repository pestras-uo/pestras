import { BehaviorSubject, Observable, distinctUntilChanged, filter, switchMap } from "rxjs";

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