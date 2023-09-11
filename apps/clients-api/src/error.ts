import { ClientsApiLogInput } from "@pestras/backend/models";
import { HttpCode } from "@pestras/backend/util";
import { Request } from "express";
import { getIpAddress } from "./get-ip-address";

export class ApiError extends Error {
  readonly input: ClientsApiLogInput;

  constructor(
    readonly req: Request<{ client: string, dataStore: string; }>,
    public readonly code: HttpCode,
    msg: string
  ) {
    super(msg);

    this.input = {
      api_serial: req.params.client,
      data_store: req.params.dataStore,
      ip: getIpAddress(req),
      msg: msg,
      type: 'error'
    }
  }
} 