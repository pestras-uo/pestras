import { Request, Response } from "express";
import { clientsApiLogModel, clientsApiModel, dataRecordsModel, dataStoresModel } from "./models";
import { ApiError } from "./error";
import { HttpCode } from "@pestras/backend/util";
import { getIpAddress } from "./get-ip-address";
import { validateValueType } from "@pestras/shared/data-model";

export async function reqHandler(req: Request<{ client: string; dataStore: string; }>, res: Response) {
  try {
    // log init request
    // --------------------------------------------------------------------------------------------
    clientsApiLogModel.insert({
      api_serial: req.params.client,
      data_store: req.params.dataStore,
      ip: getIpAddress(req),
      msg: `init request`,
      type: 'info'
    });
    // collecting arguments
    // --------------------------------------------------------------------------------------------
    const api = await clientsApiModel.getBySerial(req.params.client);

    if (!api)
      throw new ApiError(req, HttpCode.NOT_FOUND, 'client not found');

    const dataStoreOptions = api.data_stores.find(ds => ds.serial === req.params.dataStore);

    if (!dataStoreOptions)
      throw new ApiError(req, HttpCode.NOT_FOUND, 'data store options not found');

    const dataStore = await dataStoresModel.getBySerial(req.params.dataStore);

    if (!dataStore)
      throw new ApiError(req, HttpCode.NOT_FOUND, 'data store not found');

    // validating ip
    // -----------------------------------------------------------------------------------------------
    const ip = getIpAddress(req);

    if (!api.ips.includes(ip))
      throw new ApiError(req, HttpCode.UNAUTHORIZED, 'ip not allowed');

    // validating params
    // -----------------------------------------------------------------------------------------------
    const params = dataStoreOptions.params;
    const parsedParams: { [key: string]: { operator: string; value: unknown; } }[] = [];

    for (const param of params) {
      const qParam = req.query[param.alias || param.field];
      const field = dataStore.fields.find(f => f.name === param.field);

      if (!field)
        throw new ApiError(req, HttpCode.SERVIC_UNAVAILABLE, `field: '${param.field}' for param: '${param.alias || param.field}' was not found`);

      if (!qParam && param.required)
        throw new ApiError(req, HttpCode.BAD_REQUEST, `param: '${param.alias || param.field}' is required`);

      const value = qParam
        ? validateValueType(qParam, field)
        : param.default === '$$NOW'
          ? new Date()
          : param.default;

      parsedParams.push({ [field.name]: { operator: param.operator, value } });
    }

    // send response
    // -----------------------------------------------------------------------------------------------
    const search = { $and: parsedParams };
    const records = await dataRecordsModel.search(dataStore.serial, { limit: dataStoreOptions.max, search });

    clientsApiLogModel.insert({
      api_serial: req.params.client,
      data_store: req.params.dataStore,
      ip: getIpAddress(req),
      msg: `${records.results.length} from total ${records.count} records sent successfully`,
      type: 'info'
    });

    res.json(records);

  } catch (e) {
    console.error(e);

    const error = e?.input ? e : new ApiError(req, e?.code ?? HttpCode.UNKNOWN_ERROR, e.message);

    await clientsApiLogModel.insert(error.input);

    res.status(error.code).json(error.message);
  }
}