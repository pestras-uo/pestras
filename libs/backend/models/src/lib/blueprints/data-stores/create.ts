import { DataStore, DataStoreState, DataStoreType, EntityTypes, Role, User, getSystemFields } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DataStoresModel } from ".";

export type CreateDataStoreInput = Pick<DataStore, 'blueprint' | 'name' | 'type'>;

export async function create(
  this: DataStoresModel,
  data: CreateDataStoreInput,
  issuer: User
) {
  const date = new Date();
  const ds: DataStore = {
    serial: Serial.gen("DTS"),
    blueprint: data.blueprint,
    name: data.name,
    type: data.type,
    collaborators: [],
    create_date: date,
    last_modified: date,
    fields: data.type === DataStoreType.TABLE ? getSystemFields(data.blueprint) : [],
    is_active: true,
    settings: {
      interface_field: 'serial',
      sub_data_stores: [],
      history: false,
      max_attachments_count: 0,
      static: false,
      workflow: false,
      card_view: null,
      tree_view: null
    },
    web_service: null,
    aggr: null,
    state: DataStoreState.BUILD
  };

  await this.col.insertOne(ds);

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'create',
    serial: ds.serial,
    entity: EntityTypes.DATA_STORE
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return ds;
}