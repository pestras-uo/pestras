/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore, DataStoreState, DataStoreType, intervalsByMonth } from "@pestras/shared/data-model";
import { handleResponse } from "./handle-response";
import { dataStoresModel, webServiceLogModel } from "@pestras/backend/models";
import { generateRequestPayload, generateWebServiceRequest } from "@pestras/backend/util";

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
        const logSerial = await webServiceLogModel.insert(ds.serial, 'init request');
        const payload = generateRequestPayload(ds);

        await webServiceLogModel.insertSub(logSerial, 'payload generated');

        await webServiceLogModel.insertSub(logSerial, 'init http request');

        const data = await generateWebServiceRequest(ds, payload);

        await webServiceLogModel.insertSub(logSerial, 'request responded successfully');

        await handleResponse(data, ds);

        await dataStoresModel.updateWsState(ds.serial, DataStoreState.READY, true);

        webServiceLogModel.insertSub(logSerial, 'response handled successfully.');

      } catch (error: any) {
        console.error(error);

        await dataStoresModel.updateState(ds.serial, DataStoreState.ERROR);
        webServiceLogModel.insert(ds.serial, error.message ?? JSON.stringify(error), 'error');
      }
    }

  } catch (error) {
    console.error(error);
  }
}