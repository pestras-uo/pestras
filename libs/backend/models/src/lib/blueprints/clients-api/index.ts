/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientApi, ClientApiDataStoreParam, User } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { exists, getByBlueprint, getBySerial, nameExists } from "./read";
import { create, CreateClientApiInput } from "./create";
import { update } from "./update";
import { addIP, removeIP } from "./ip";
import { addDataStore, removeDataStore, updateDataStore, AddClientApiDataStoreInput, UpdateClientApiDataStoreInput } from "./data-stores";
import { addParam, removeParam, updateParam, AddClientApiParamInput, UpdateClientApiParamInput } from "./params";
import { deleteClientApi } from "./delete";

export { CreateClientApiInput, AddClientApiDataStoreInput, UpdateClientApiDataStoreInput, AddClientApiParamInput, UpdateClientApiParamInput };

export class ClientApiModel extends Model<ClientApi> {

  getByBlueprint: (blueprint: string, projection?: any) => Promise<ClientApi[]> = getByBlueprint.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<ClientApi | null> = getBySerial.bind(this);
  exists: (serial: string) => Promise<boolean> = exists.bind(this);
  nameExists: (name: string, exclude?: string) => Promise<boolean> = nameExists.bind(this);

  create: (input: CreateClientApiInput, issuer: User) => Promise<ClientApi> = create.bind(this);
  update: (serial: string, clientName: string, issuer: User) => Promise<Date> = update.bind(this);

  addIP: (serial: string, ip: string, issuer: User) => Promise<Date> = addIP.bind(this);
  removeIP: (serial: string, ip: string, issuer: User) => Promise<Date> = removeIP.bind(this);

  addDataStore: (serial: string, ds: string, options: AddClientApiDataStoreInput, issuer: User) => Promise<Date> = addDataStore.bind(this);
  updateDataStore: (serial: string, ds: string, options: AddClientApiDataStoreInput, issuer: User) => Promise<Date> = updateDataStore.bind(this);
  removeDataStore: (serial: string, ds: string, issuer: User) => Promise<Date> = removeDataStore.bind(this);

  addParam: (serial: string, ds: string, options: AddClientApiParamInput, issuer: User) => Promise<{ param: ClientApiDataStoreParam; date: Date; }> = addParam.bind(this);
  updateParam: (serial: string, ds: string, param_serial: string, options: AddClientApiParamInput, issuer: User) => Promise<Date> = updateParam.bind(this);
  removeParam: (serial: string, ds: string, param_serial: string, issuer: User) => Promise<Date> = removeParam.bind(this);

  delete: (serial: string, issuer: User) => Promise<boolean> = deleteClientApi.bind(this);
}