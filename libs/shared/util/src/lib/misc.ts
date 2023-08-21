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

export function range(start: number, end?: number, step?: number) {
  const result: number[] = [];

  if (start > 0 && end === undefined) {
    for (let i = 0; i <= start; i++)
      result.push(i);
    
    return result;
  }

  if ((start !== 0 && !start) || (end !== 0 && !end))
    return result;

  step = step || 1
  step = Math.abs(step);
  step = start < end ? step : step *= -1;

  let counter = start;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    result.push(counter);
    counter += step;

    if ((step < 0 && counter < end) || (step > 0 && counter > end))
      break;
  }

  return result;
}