/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordsModel, DataStoresModel, WebServiceLogModel } from "@pestras/backend/models";
import config from "./config";

export class RecordsModel extends DataRecordsModel {

  col(name: string) {
    return this.db.collection(name);
  }

  dropCol(name: string) {
    return this.db.dropCollection(name);
  }

}

export class DataStoresExtendedModel extends DataStoresModel {

  async updateWsState(serial: string, update: any) {
    return this.col.updateOne({ serial }, update);
  }
}

export const dataStoresModel = new DataStoresExtendedModel(config.dbUoName, 'dataStores');
export const dataRecordsModel = new RecordsModel();
export const wsLogModel = new WebServiceLogModel(config.dbUoDataName, 'web-service-log');