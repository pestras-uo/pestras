/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeKind, TypedEntity, parseValue } from "../../../util";

export const dataVizFilterOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'] as const;
export const dataVizRangeFilterOperators = ['inRange', 'outRange', 'aboveRange', 'aboveOrInRange', 'belowRange', 'belowOrInRange'] as const;

export type DataVizFilterOperator = typeof dataVizFilterOperators[number];
export type DataVizRangeFilterOperator = typeof dataVizRangeFilterOperators[number];

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

const rangeFilterOperatorsMap: Record<DataVizFilterOperator, DataVizRangeFilterOperator> = {
  eq: 'inRange',
  ne: 'outRange',
  gt: 'aboveRange',
  gte: 'aboveOrInRange',
  lt: 'belowRange',
  lte: 'belowOrInRange'
}

export function dataVizFilterData<T extends Record<string, any>>(data: T[], opt: DataVizFilters, fields: TypedEntity[]): T[] {
  return opt.filters && opt.filters.length
    ? opt.any
      ? data.filter(r => opt.filters.some(f => {
        const field = fields.find(field => field.name === f.field);
        const operator = (f.operator.startsWith('$') ? f.operator.slice(1) : f.operator) as DataVizFilterOperator;
        
        return field && field.kind === TypeKind.RANGE
          ? dataVizFilters[rangeFilterOperatorsMap[operator]](r[f.field], f.value)
          : dataVizFilters[operator](r[f.field], f.value)
      }))
      : data.filter(r => opt.filters.every(f => {
        const field = fields.find(field => field.name === f.field);
        const operator = (f.operator.startsWith('$') ? f.operator.slice(1) : f.operator) as DataVizFilterOperator;

        return field && field.kind === TypeKind.RANGE
          ? dataVizFilters[rangeFilterOperatorsMap[operator]](r[f.field], f.value)
          : dataVizFilters[operator](r[f.field], f.value)
      }))
    : data;
}

export const dataVizFilters: Record<DataVizFilterOperator | DataVizRangeFilterOperator, (v1: any, v2: any) => boolean> = {
  eq: (v1: any, v2: any) => parseValue(v1) === parseValue(v2),
  ne: (v1: any, v2: any) => parseValue(v1) !== parseValue(v2),
  gt: (v1: any, v2: any) => v1 > v2,
  gte: (v1: any, v2: any) => v1 >= v2,
  lt: (v1: any, v2: any) => v1 < v2,
  lte: (v1: any, v2: any) => v1 <= v2,
  inRange: (v1: any, v2: any) => v1 >= v2[0] && v1 <= v2[1],
  outRange: (v1: any, v2: any) => v1 < v2[0] || v1 > v2[1],
  aboveRange: (v1: any, v2: any) => v1 > v2[1],
  aboveOrInRange: (v1: any, v2: any) => v1 >= v2[1],
  belowRange: (v1: any, v2: any) => v1 < v2[0],
  belowOrInRange: (v1: any, v2: any) => v1 <= v2[0]
}