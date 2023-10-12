import { DataStoreType, TableDataRecord } from "@pestras/shared/data-model";
import { DataRecordsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { dataStoresModel, recordsWorkflowModel } from "../../models";

export async function deleteRecod(
  this: DataRecordsModel,
  dsSerial: string,
  recordSerial: string,
  draft: boolean,
  message?: string
) {
  const ds = await dataStoresModel.getBySerial(dsSerial, { serial: 1, type: 1, settings: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');
  // type must be template
  if (ds.type !== DataStoreType.TABLE)
    throw new HttpError(HttpCode.FORBIDDEN, 'unsupportedDataStoreType');

  // get record from published records collection
  const record = draft
    ? await this.db.collection<TableDataRecord>(`draft_${dsSerial}`).findOne({ serial: recordSerial }, { projection: { _id: 0 } })
    : await this.db.collection<TableDataRecord>(dsSerial).findOne({ serial: recordSerial }, { projection: { _id: 0 } });

  // iwhen not found find it from draft collection and remove at once
  if (!record)
    return true;

  // if workflow applied on delete start workflow
  if (!draft && typeof ds.settings.workflow.delete === 'string') {
    await recordsWorkflowModel.publish(dsSerial, recordSerial, 'delete', message);

    return true;

    // or block operation when granted
  } else if (ds.settings.workflow.delete === false)
    throw new HttpError(HttpCode.FORBIDDEN, 'deleteRecordNotAllowed');

  // delete record
  if (draft)
    await this.db.collection(`draft_${ds.serial}`).deleteOne({ serial: recordSerial });
  else {
    await this.db.collection(ds.serial).deleteOne({ serial: recordSerial });
    await this.db.collection(`draft_${ds.serial}`).deleteOne({ serial: recordSerial });
    await this.db.collection(`review_${ds.serial}`).deleteOne({ serial: recordSerial });
    await this.db.collection(`workflow_${ds.serial}`).deleteOne({ record: recordSerial });
    await this.db.collection(`history_${ds.serial}`).deleteMany({ record: recordSerial });
  }

  return true;
}