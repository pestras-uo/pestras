/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedEntity } from '../../../util';
import { DataVizFilters, dataVizFilterData } from './filter';
import { DataVizGroup, groupRecords, groupRecordsFields } from './group';
import { DataVizLimit, limitRecords } from './limit';
import { DataVizSort, sortRecords } from './sort';
import { DataVizTranspose, transposeRecords, transposeRecordsFields } from './transpose';

export * from './filter';
export * from './group';
export * from './limit';
export * from './sort';
export * from './transpose';

export type DataVizAggrStage = DataVizFilters | DataVizGroup | DataVizLimit | DataVizSort | DataVizTranspose;

export function aggrRecords<T extends Record<string, any>>(fields: TypedEntity[], data: T[], pipeline: DataVizAggrStage[]): { fields: TypedEntity[], data: T[] } {
  let outputFields: TypedEntity[] = fields;

  const outputData = pipeline.reduce((result: any[], curr: DataVizAggrStage) => {

    if (curr.type === 'filter')
      return dataVizFilterData(result, curr);

    if (curr.type === 'group') {
      outputFields = groupRecordsFields(outputFields, curr);
      return groupRecords(result, curr);
    }

    if (curr.type === 'limit')
      return limitRecords(result, curr);

    if (curr.type === 'sort')
      return sortRecords(result, curr);

    if (curr.type === 'transpose') {
      const output = transposeRecords(result, curr);
      outputFields = transposeRecordsFields(outputFields, output, curr);
      return output;
    }

    return result;

  }, data as T[]);

  return { fields: outputFields, data: outputData };
}