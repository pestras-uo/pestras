/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecordsModel, DataStoresModel, WebServiceErrorLogModel, WebServiceLogModel } from "@pestras/backend/models";

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

export const dataStoresModel = new DataStoresExtendedModel('uo', 'dataStores');
export const dataRecordsModel = new RecordsModel();
export const wsLogModel = new WebServiceLogModel('uo-data', 'web-service-log');
export const wsErrorLogModel = new WebServiceErrorLogModel('uo-data', 'web-service-error-log');