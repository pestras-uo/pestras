import { DataStoreState, EntityTypes, DataStoreSettings, User } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function setTableSettings(
  this: DataStoresModel,
  serial: string,
  settings: DataStoreSettings,
  issuer: User
) {
  const date = new Date();
  const ds = await this.getBySerial(serial, { state: 1, settings: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (ds.state !== DataStoreState.BUILD) {
    settings.static = ds.settings.static;
    settings.workflow = ds.settings.workflow;
  }

  await this.col.updateOne({ serial }, { $set: { settings, last_modified: date } });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setTableSettings',
    serial: ds.serial,
    entity: EntityTypes.DATA_STORE,
    payload: settings
  }, {
    orgunits: [issuer.orgunit]
  });

  return date;
}