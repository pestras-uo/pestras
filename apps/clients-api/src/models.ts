import { ClientApiModel, ClientsApiLogModel, DataRecordsModel, DataStoresModel } from "@pestras/backend/models";

export const dataStoresModel = new DataStoresModel('uo', 'dataStores');
export const clientsApiModel = new ClientApiModel('uo', 'dataStores');
export const dataRecordsModel = new DataRecordsModel();
export const clientsApiLogModel = new ClientsApiLogModel('uo-data-dev', 'clients-api-log');