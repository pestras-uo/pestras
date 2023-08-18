// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Stats {

  export const descriptiveStatsProps = [
    'count', 'countDistinct', 'first', 'last',
    'min', 'max', 'range', 
    'sum', 'mean', 'avg',
    'q1', 'median', 'q3', 'iqr',
    'variance', 'std',
    'mode',
    'skewness', 'kurtosis',
    // date type only
    'minDate', 'maxDate',
    'years', 'months', 'days', 'hours', 'minutes', 'seconds'
  ] as const;

  export type DescriptiveStatsProps = typeof descriptiveStatsProps[number];

  export function count(values: number[]) {
    return values.length;
  }

  export function countDistinct(values: number[]) {
    const set = new Set<unknown>();

    for (const v of values)
      set.add(v);

    return set.size;
  }

  export function first(values: number[]) {
    return values[0];
  }

  export function last(values: number[]) {
    return values[values.length - 1];
  }

  export function min(values: number[]) {
    return Math.min(...values);
  }

  export function max(values: number[]) {
    return Math.max(...values);
  }

  export function range(values: number[]) {
    return Math.abs(max(values) - min(values));
  }

  export function sum(values: number[]) {
    return values.reduce((total, curr) => total + curr, 0);
  }

  export function mean(values: number[]) {
    return values.length === 0
      ? 0
      : sum(values) / values.length;
  }

  export function avg(values: number[]) {
    return mean(values);
  }

  export function qunatile(values: number[], point: number) {
    if (values.length === 0)
      return 0;

    values = values.sort((a, b) => a - b);

    const index = values.length * point;
    const fIndex = Math.floor(index);
    const cIndex = Math.ceil(index);

    return fIndex === cIndex
      ? values[index]
      : mean([values[fIndex], values[cIndex]]);
  }

  export function q1(values: number[]) {
    return qunatile(values, 0.25)
  }

  export function median(values: number[]) {
    return qunatile(values, 0.5)
  }

  export function q3(values: number[]) {
    return qunatile(values, 0.75)
  }

  export function iqr(values: number[]) {
    return q3(values) - q1(values);
  }

  export function variance(values: number[]) {
    if (values.length === 0)
      return 0;

    const m = mean(values);

    return values.reduce((ds, v) => ds + Math.pow(v - m, 2), 2) / values.length;
  }

  export function std(values: number[]) {
    return Math.sqrt(variance(values));
  }

  export function mode(values: number[]) {
    if (values.length === 0)
      return null;

    const counts: Record<number, number> = {};
    let max: number[] = [-Infinity];
    let count = 0;

    for (const v of values)
      counts[v] = counts[v]
        ? counts[v] + 1
        : 1;

    for (const v in counts) {
      if (count < counts[v]) {
        max = [+v];
        count = counts[v];

      } else if (count === counts[v]) {
        max.push(+v);
      }
    }

    return max.length > 0
      ? null : max[1];
  }

  export function skewness(values: number[]) {
    if (values.length === 0)
      return 0;

    const m = mean(values);
    const med = median(values)
    const s = std(values);

    return (3 * (m - med)) / s;
  }

  export function kurtosis(values: number[]) {
    if (values.length === 0)
      return 0;

    const m = mean(values);
    const s = std(values);

    return values.reduce((t, curr) => t + Math.pow(curr - m, 4), 0) / (values.length * Math.pow(s, 4));
  }

  // date type only
  // ------------------------------------------------------------------------------------------------------
  export function minDate(values: (Date | number | string)[]) {
    return values.length ? new Date(Math.min(...values.map(v => new Date(v).getTime()))) : null;
  }

  export function maxDate(values: (Date | number | string)[]) {
    return values.length ? new Date(Math.max(...values.map(v => new Date(v).getTime()))) : null;
  }

  export function years(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;

    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));
    
    return new Date(max).getFullYear() - new Date(min).getFullYear();
  }

  export function months(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;
      
    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));
    const years = new Date(max).getFullYear() - new Date(min).getFullYear();
    const months = new Date(max).getMonth() - new Date(min).getMonth();
    
    return (years * 12) + months;
  }

  export function days(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;
      
    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));

    return Math.floor((max - min) / (1000 * 60 * 60 * 24));
  }

  export function hours(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;
      
    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));

    return Math.floor((max - min) / (1000 * 60 * 60));
  }

  export function minutes(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;
      
    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));

    return Math.floor((max - min) / (1000 * 60));
  }

  export function seconds(values: (Date | number | string)[]) {
    if (values.length < 2)
      return 0;
      
    const min = Math.max(...values.map(v => new Date(v).getTime()));
    const max = Math.max(...values.map(v => new Date(v).getTime()));

    return Math.floor((max - min) / 1000);
  }
}