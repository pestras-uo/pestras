/* eslint-disable @typescript-eslint/no-explicit-any */
import { objUtil } from "./objects";

export type Optional<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>;

export type Nullable<T> = T | null;

export function isNull(value: unknown): value is null {
  return value === null || value === undefined;
}

export function sorter(fields: Record<string, -1 | 1>) {
  return (a: any, b: any) => {
    for (const field in fields) {
      const aVal = objUtil.getValueFromPath(field, a);
      const bVal = objUtil.getValueFromPath(field, b);

      if (aVal !== bVal)
        return fields[field] * (aVal > bVal ? 1 : -1);
    }

    return 0;
  }
}