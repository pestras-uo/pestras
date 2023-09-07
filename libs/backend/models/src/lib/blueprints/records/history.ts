/* eslint-disable @typescript-eslint/no-explicit-any */
import { Serial } from "@pestras/shared/util";
import { DataRecordsModel } from ".";
import { DataRecordHistroyItem, TableDataRecord } from "@pestras/shared/data-model";
import { HttpCode, HttpError } from "@pestras/backend/util";

export async function pushHistory(
  this: DataRecordsModel,
  dataStore: string,
  record: any
) {
  const col = this.db.collection(`history_${dataStore}`);

  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    state: record
  };

  await col.insertOne(snapshot);

  return true;
}

// Revert
// -------------------------------------------------------------------------------
export async function revertHistory(this: DataRecordsModel, ds: string, serial: string) {
  const historyColName = `history_${ds}`;
  const state = await this.db.collection<DataRecordHistroyItem>(historyColName).findOne({ serial });

  if (!state)
    throw new HttpError(HttpCode.NOT_FOUND, 'historyNotFound');

  const record = await this.getBySerial<TableDataRecord>(ds, state.record);

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');
  
  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    state: record
  }

  // save new record state
  await this.db.collection(ds).updateOne({ serial: record.serial }, { $set: { ...state, last_modified: new Date() } });
  // save previous record state
  await this.db.collection(historyColName).insertOne(snapshot);

  return record;
}