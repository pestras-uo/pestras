/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore, DataStoreState, DataStoreType, intervalsByMonth } from "@pestras/shared/data-model";
import { dataStoresModel, wsLogModel } from "./models";
import { generateRequestPayload } from "./generate-payload";
import { handleRequest } from "./handle-request";
import { handleResponse } from "./handle-response";

export async function job(init: boolean) {

  const date = new Date();
  const today = date.getDate();
  const month = date.getMonth();
  const intervals = intervalsByMonth[month];
  const query: any = init ? {
    type: DataStoreType.WEB_SERVICE,
    is_active: true,
    state: { $in: [DataStoreState.READY, DataStoreState.READY] },
    'settings.initialized': false
  } : {
    type: DataStoreType.WEB_SERVICE,
    is_active: true,
    'settings.intervals': { $in: intervals },
    'settings.initialized': true,
    $or: [
      {
        state: DataStoreState.READY,
        'settings.fetch_day': today,

      },
      { state: DataStoreState.ERROR }
    ]
  };

  try {
    const dataStores: DataStore[] = await dataStoresModel.search(query, 0, 0, { serial: 1, web_service: 1 });

    for (const ds of dataStores) {
      try {
        const logSerial = await wsLogModel.insert(ds.serial, 'init request');
        const payload = generateRequestPayload(ds);

        await wsLogModel.insertSub(logSerial, 'payload generated');

        const data = await handleRequest(ds, payload, logSerial);

        await wsLogModel.insertSub(logSerial, 'request responded successfully');

        await handleResponse(data, ds);

        await dataStoresModel.update({ serial: ds.serial }, {
          $set: {
            state: DataStoreState.READY,
            initialized: true,
            last_modified: new Date()
          }
        });

        wsLogModel.insertSub(logSerial, 'response handled successfully.');

      } catch (error: any) {
        console.error(error);

        await dataStoresModel.updateWsState(ds.serial, { state: DataStoreState.ERROR });
        wsLogModel.insert(ds.serial, error.message ?? JSON.stringify(error), 'error');
      }
    }

  } catch (error) {
    console.error(error);
  }
}