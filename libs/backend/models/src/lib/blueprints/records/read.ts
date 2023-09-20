/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordHistroyItem, DataRecord, ApiQuery, DataRecordState } from "@pestras/shared/data-model";
import { Filter } from "mongodb";
import { DataRecordsModel } from ".";

export async function search(
  this: DataRecordsModel,
  dataStoreSerial: string,
  query: ApiQuery<DataRecord>
) {
  const col = this.db.collection<DataRecord>(dataStoreSerial);
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
  state = DataRecordState.PUBLISHED
) {
  return state === DataRecordState.PUBLISHED
    ? await this.db.collection<DataRecord>(dataStoreSerial).findOne({ serial })
    : state === DataRecordState.REVIEW
      ? await this.db.collection<DataRecord>(`review_${dataStoreSerial}`).findOne({ serial })
      : await this.db.collection<DataRecord>(`draft_${dataStoreSerial}`).findOne({ serial })
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