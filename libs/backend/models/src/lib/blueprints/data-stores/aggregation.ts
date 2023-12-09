import {
  AggrStageTypes,
  AggregationDataStoreConfig,
  DataStoreState,
  DataStoreType,
  EntityTypes,
  Role,
  TypedEntity,
  User,
  aggrPipelineFactory,
  createField,
} from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function setAggregation(
  this: DataStoresModel,
  serial: string,
  aggr: AggregationDataStoreConfig,
  issuer: User
) {
  const date = new Date();
  const ds = await this.getBySerial(serial, {
    serial: 1,
    settings: 1,
    type: 1,
    is_active: 1,
    state: 1,
    aggr: 1
  });

  if (!ds) throw new HttpError(HttpCode.NOT_FOUND, "dataStoreNotFound");

  if (!ds.is_active)
    throw new HttpError(HttpCode.FORBIDDEN, "dataStoreIsInactive");

  if (ds.type !== DataStoreType.AGGREGATIONAL)
    throw new HttpError(HttpCode.FORBIDDEN, "notAllowedDataStoreType");

  // regenration fields
  const initState = await this.getFields(aggr.from ?? "");

  if (initState.length === 0)
    throw new HttpError(HttpCode.FORBIDDEN, "noFieldsFoundInInitState");

  const joinsFiels: Record<string, TypedEntity[]> = {};

  for (const stage of aggr.pipeline) {
    if (stage.type === AggrStageTypes.JOIN)
      joinsFiels[stage.options.dataStore] = await this.getFields(
        stage.options.dataStore
      );
  }

  // prepare for aggregation pipeline
  const aggrPipeline = aggrPipelineFactory(
    aggr.pipeline,
    initState,
    (serial: string) => joinsFiels[serial]
  );

  const aggrFields = aggrPipeline.outputType().map((f) => createField(f));

  await this.col.updateOne({ serial }, { $set: { aggr, fields: aggrFields } });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'setAggregation',
    serial,
    entity: EntityTypes.DATA_STORE
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  // if data store already built
  // recreate the database view with the new aggregation
  if (ds.state !== DataStoreState.BUILD) await this.buildView(ds, true);

  return await this.getBySerial(serial);
}
