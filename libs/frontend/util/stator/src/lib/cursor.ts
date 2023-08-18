/* eslint-disable @typescript-eslint/no-explicit-any */
import { sorter } from "@pestras/shared/util";

export class Cusror<T extends Record<keyof T, any>> {

  constructor(private data: T[]) { }

  slice(start: number, end?: number) {
    this.data = this.data.slice(start, end);
    return this;
  }

  page(index?: number, size?: number) {
    if (!index)
      return this;

    size = size || 10;

    return this.slice(
      (index - 1) * size,
      (index - 1) * size + size
    );
  }

  sort(options?: Record<keyof T, -1 | 1>) {
    if (!options)
      return this;

    this.data = this.data.sort(sorter(options));
    return this;
  }

  project(fields?: Record<keyof T, 0> | Record<keyof T, 1>) {
    if (!fields)
      return this;
      
    const result: Array<Partial<T>> = [];
    let mode: 'omit' | 'pick' = 'pick';

    for (const prop in fields) {
      mode = fields[prop] === 1 ? 'pick' : 'omit';
      break;
    }

    if (mode === 'pick') {
      for (const item of this.data) {
        const newItem: Partial<T> = {};

        for (const prop in fields)
          newItem[prop] = item[prop];

        result.push(newItem);
      }

    } else {
      for (const item of this.data) {
        const newItem: Partial<T> = {};

        for (const prop in item)
          if (fields[prop] !== 0)
            newItem[prop] = item[prop];

        result.push(newItem);
      }
    }

    this.data = result as T[];
    return this;
  }

  toArray() {
    return this.data;
  }
}