/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordHistroyItem, DataRecord, ApiQuery, TableDataRecord } from "@pestras/shared/data-model";
import { Filter } from "mongodb";
import { DataRecordsModel } from ".";

export async function search(
  this: DataRecordsModel,
  dataStoreSerial: string,
  query: Partial<ApiQuery<DataRecord>>
) {
  const col = this.db.collection<TableDataRecord>(dataStoreSerial);
  const count = await col.countDocuments(query.search ?? {} as Filter<any>);

  if (!count)
    return { count, results: [] };
  
  const results = await col.find(query.search as any ?? {}, {
    sort: query.sort as any ?? { _id: 1 },
    skip: query.skip ?? 0,
    limit: query.limit ?? 10,
    projection: query.select || {}
  })
    .toArray();

  return { count, results };
}

export async function getBySerial(
  this: DataRecordsModel,
  dataStoreSerial: string,
  serial: string,
  projection?: Record<string, 0 | 1>
) {
  return this.db.collection<TableDataRecord>(dataStoreSerial).findOne({ serial }, projection);
}

export async function getCategoryValues(
  this: DataRecordsModel,
  dataStoreSerial: string,
  categoryField: string,
  search: unknown
) {
  const res = await this.db.collection<TableDataRecord>(dataStoreSerial)
    .aggregate([
      { $match: search },
      { $group: { _id: `$${categoryField}` } }
    ]).toArray();

  return res.map(record => record['_id'] as string);
}

export async function getHistory(
  this: DataRecordsModel,
  dataStoreSerial: string,
  serial: string
) {
  return this.db
    .collection<DataRecordHistroyItem>(`history_${dataStoreSerial}`)
    .find({ record: serial }).toArray();
}