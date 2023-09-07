/* eslint-disable @typescript-eslint/no-explicit-any */
import { Serial, objUtil } from "@pestras/shared/util";
import { DataRecordsModel } from ".";
import { DataRecordHistroyItem, TableDataRecord } from "@pestras/shared/data-model";
import { HttpCode, HttpError } from "@pestras/backend/util";

export async function pushHistory(
  this: DataRecordsModel,
  dataStore: string,
  record: any,
  fields: string[]
) {
  const col = this.db.collection(`history_${dataStore}`)
  const changes: any = {};

  for (const field of fields)
    changes[field] = record[field];

  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    changes
  };

  await col.insertOne(snapshot);

  return true;
}


// -------------------------------------------------------------------------------
export async function applyHistory(this: DataRecordsModel, ds: string, serial: string) {
  const historyColName = `history_${ds}`;
  const history = await this.db.collection<DataRecordHistroyItem>(historyColName).findOne({ serial });

  if (!history)
    throw new HttpError(HttpCode.NOT_FOUND, 'historyNotFound');

  const record = await this.getBySerial<TableDataRecord>(ds, history.record);

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  // get copy of current state before applying
  const changes = objUtil.omit(objUtil.cloneObject(record), Object.keys(history.changes));
  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    changes
  };

  // apply history
  objUtil.deepMerge(record, history.changes);

  // save new record state
  await this.db.collection(ds).updateOne({ serial: history.record }, { $set: { ...record, last_modified: new Date() } });

  // save previous record state
  await this.db.collection(historyColName).insertOne(snapshot);

  return record;
}

// Revert
// -------------------------------------------------------------------------------
export async function revertHistory(this: DataRecordsModel, ds: string, serial: string) {
  const historyColName = `history_${ds}`;
  const start = await this.db.collection<DataRecordHistroyItem>(historyColName).findOne({ serial });

  if (!start)
    throw new HttpError(HttpCode.NOT_FOUND, 'historyNotFound');

  const stack = await this.db.collection<DataRecordHistroyItem>(historyColName)
    .find({ last_modified: { $gt: start.last_modified } })
    .toArray();

  const record = await this.getBySerial<TableDataRecord>(ds, start.record);

  if (!record)
    throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

  // join history records with the right order
  const orderedStack = stack.concat(start)
    .sort((a, b) => b.last_modified.getTime() - a.last_modified.getTime());

  // collect all key going to change after reverting
  const changedKeys = orderedStack.reduce((s: Set<string>, curr) => {
    const keys = Object.keys(curr.changes);

    for (const k of keys)
      s.add(k);

    return s;
  }, new Set<string>());

  // get copy of current record state before reverting
  const changes = objUtil.omit(objUtil.cloneObject(record), Array.from(changedKeys));
  const snapshot = {
    serial: Serial.gen("HST"),
    record: record.serial,
    last_modified: record.last_modified,
    changes
  }

  // apply revert by order
  orderedStack
    .forEach(h => objUtil.deepMerge(record, h.changes));

  // save new record state
  await this.db.collection(ds).updateOne({ serial: record.serial }, { $set: { ...record, last_modified: new Date() } });
  // save previous record state
  await this.db.collection(historyColName).insertOne(snapshot);

  return record;
}