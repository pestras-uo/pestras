import { ClientApi } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { exists, getByBlueprint, getBySerial, nameExists } from "./read";
import { create } from "./create";
import { update } from "./update";
import { addIP, removeIP } from "./ip";
import { addDataStore, removeDataStore, updateDataStore } from "./data-stores";
import { addParam, removeParam, updateParam } from "./params";
import { deleteClientApi } from "./delete";

export { CreateClientApiInput } from './create';
export { AddClientApiDataStoreInput, UpdateClientApiDataStoreInput } from './data-stores';
export { AddClientApiParamInput, UpdateClientApiParamInput } from './params';

export class ClientApiModel extends Model<ClientApi> {

  getByBlueprint = getByBlueprint.bind(this);
  getBySerial = getBySerial.bind(this);
  exists = exists.bind(this);
  nameExists = nameExists.bind(this);

  create = create.bind(this);
  update = update.bind(this);

  addIP = addIP.bind(this);
  removeIP = removeIP.bind(this);

  addDataStore = addDataStore.bind(this);
  updateDataStore = updateDataStore.bind(this);
  removeDataStore = removeDataStore.bind(this);

  addParam = addParam.bind(this);
  updateParam = updateParam.bind(this);
  removeParam = removeParam.bind(this);

  delete = deleteClientApi.bind(this);
}