/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordsModel } from ".";

export function pushHistory(
  this: DataRecordsModel,
  dataStore: string,
  serial: string,
  record: any,
  fields: string[]
) {
  const entry: any = { serial };
  const col = this.db.collection(`history_${dataStore}`)

  for (const field of fields)
    entry[field] = record[field];

  entry.last_modified = record.last_modified;
  entry.update_by = record.update_by;

  return col.insertOne(entry);
}