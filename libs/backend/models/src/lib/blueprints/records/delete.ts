import { DataStore, DataStoreType, EntityTypes, User } from "@pestras/shared/data-model";
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function deleteRecod(
  this: DataRecordsModel,
  dataStore: DataStore,
  recordSerial: string,
  issuer: User
) {
  // type must be template
  if (dataStore.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, 'unsupportedDataStoreType');

  const record = await this.getBySerial(dataStore.serial, recordSerial);

  if (!record)
    return true;

  // delete record
  await this.db.collection(dataStore.serial).deleteOne({ serial: recordSerial });
  // delete record history
  await this.db.collection(`history_${dataStore.serial}`).deleteMany({ record: recordSerial });
  // delete workflow
  // if (dataStore.settings.workflow)
  //   await this.db.collection(`workflow_${dataStore.serial}`).deleteOne({ record: recordSerial });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: new Date(),
    method: 'delete',
    serial: recordSerial,
    entity: EntityTypes.RECORD,
    payload: { data_store: dataStore.serial }
  });

  return true;
}