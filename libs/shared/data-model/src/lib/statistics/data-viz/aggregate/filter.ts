/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseValue } from "../../../util";

export const dataVizFilterOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'] as const;

export type DataVizFilterOperator = typeof dataVizFilterOperators[number];

export interface DataVizFilter {
  field: string;
  operator: DataVizFilterOperator;
  value: any;
}

export interface DataVizFilters {
  type: 'filter';
  any: boolean;
  filters: DataVizFilter[];
}

export function dataVizFilterData<T extends Record<string, any>>(data: T[], opt: DataVizFilters): T[] {
  return opt.filters && opt.filters.length
    ? opt.any
      ? data.filter(r => opt.filters.some(f => dataVizFilters[f.operator](r[f.field], f.value)))
      : data.filter(r => opt.filters.every(f => dataVizFilters[f.operator](r[f.field], f.value)))
    : data;
}

export const dataVizFilters: Record<DataVizFilterOperator, (v1: any, v2: any) => boolean> = {
  eq: (v1: any, v2: any) => parseValue(v1) === parseValue(v2),
  ne: (v1: any, v2: any) => parseValue(v1) !== parseValue(v2),
  gt: (v1: any, v2: any) => v1 > v2,
  gte: (v1: any, v2: any) => v1 >= v2,
  lt: (v1: any, v2: any) => v1 < v2,
  lte: (v1: any, v2: any) => v1 <= v2,
}