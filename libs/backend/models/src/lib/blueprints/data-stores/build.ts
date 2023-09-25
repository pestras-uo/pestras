import { AggrStageTypes, DataStore, DataStoreState, DataStoreType, EntityTypes, Role, TypedEntity, User, aggrPipelineFactory } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function build(
  this: DataStoresModel,
  serial: string,
  issuer: User
) {
  const date = new Date();
  const ds = await this.getBySerial(serial, { type: 1, serial: 1, settings: 1, state: 1, fields: 1, aggr: 1 });

  if (!ds)
    throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

  if (ds.state !== DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreAlreadyBuilt');

  if (ds.type !== DataStoreType.AGGREGATIONAL) {

    if (ds.fields.length === 0)
      throw new HttpError(HttpCode.FORBIDDEN, 'dataStoreHosNoFieldsDefined');

    await this.dataDB.createCollection(ds.serial);

    // if data store type is table:
    // then create history collection
    // also create workflow collection if workflow is enabled
    if (ds.type === DataStoreType.TABLE) {
      await this.dataDB.createCollection(`draft_${ds.serial}`);
      await this.dataDB.createCollection(`history_${ds.serial}`);

      if (typeof ds.settings.workflow === 'string') {
        await this.dataDB.createCollection(`review_${ds.serial}`);
        await this.dataDB.createCollection(`workflow_${ds.serial}`);
      }
    }

  } else {
    await this.buildView(ds);
  }

  await this.col.updateOne({ serial }, { $set: { state: DataStoreState.READY, last_modified: date } });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateState',
    serial,
    entity: EntityTypes.DATA_STORE,
    payload: { state: DataStoreState.BUILD }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return true;
}

export async function buildView(this: DataStoresModel, ds: DataStore, rebuild = false) {
  const aggr = ds.aggr;

  if (!aggr || !aggr.from || !aggr.pipeline.length)
    throw new HttpError(HttpCode.FORBIDDEN, 'aggrNotProvided');

  const srcDs = await this.getBySerial(aggr.from, { state: 1, fields: 1 });

  if (!srcDs)
    throw new HttpError(HttpCode.NOT_FOUND, 'srcDataStoreNotFound');

  if (srcDs.state === DataStoreState.BUILD)
    throw new HttpError(HttpCode.FORBIDDEN, 'srcDataStoreNotBuilt');

  const joinsFields: Record<string, TypedEntity[]> = {};

  // for each join stage, get joined data store fields to mutate pipeline state
  for (const stage of aggr.pipeline) {
    if (stage.type === AggrStageTypes.JOIN) {
      const joinSrc = await this.getBySerial(stage.options.dataStore, { state: 1, fields: 1 })

      if (!joinSrc)
        throw new HttpError(HttpCode.NOT_FOUND, 'joinDataStoreNotFound');

      if (joinSrc.state === DataStoreState.BUILD)
        throw new HttpError(HttpCode.FORBIDDEN, 'joinDataStoreNotBuilt');

      joinsFields[stage.options.dataStore] = joinSrc.fields;
    }
  }

  // prepare for aggregation pipeline
  const aggrPipeline = aggrPipelineFactory(
    aggr.pipeline,
    srcDs.fields,
    (serial: string) => joinsFields[serial]);

  if (rebuild)
    await this.dataDB.collection(ds.serial).drop();

  // create database view
  await this.dataDB.createCollection(ds.serial, {
    viewOn: aggr.from,
    pipeline: aggrPipeline.compile()
  });
}