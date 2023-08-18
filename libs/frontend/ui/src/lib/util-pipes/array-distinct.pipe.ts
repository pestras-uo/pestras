import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayDistinct'
})
export class ArrayDistinctPipe implements PipeTransform {

  transform<T>(arr: T[] | null): T[]
  transform<T, U extends keyof T>(arr: T[] | null, field: U): T[U][]
  transform<T, U extends keyof T>(arr: T[] | null, field?: U): T[] | T[U][] {
    return arr
      ? field
        ? [...new Set(arr.map(entry => entry[field]))]
        : [...new Set(arr)]
      : [];
  }

}
