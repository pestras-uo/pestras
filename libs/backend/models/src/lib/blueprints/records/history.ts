/* eslint-disable @typescript-eslint/no-explicit-any */
import { Serial, objUtil } from "@pestras/shared/util";
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
    state: objUtil.omit(record, ['_id'])
  };

  await col.insertOne(snapshot);

  return true;
}

// Revert
// -------------------------------------------------------------------------------
export async function revertHistory(this: DataRecordsModel, ds: string, serial: string) {
  const historyColName = `history_${ds}`;
  const history = await this.db.collection<DataRecordHistroyItem>(historyColName).findOne({ serial });

  if (!history)
    throw new HttpError(HttpCode.NOT_FOUND, 'historyNotFound');

  const record = await this.getBySerial<TableDataRecord>(ds, history.record);

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');
  
  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    state: objUtil.omit(record, ['_id'])
  }

  // save new record state
  await this.db.collection(ds).updateOne({ serial: record.serial }, { $set: { ...history.state, last_modified: new Date() } });
  // save previous record state
  await this.db.collection(historyColName).insertOne(snapshot);

  return history.state;
}