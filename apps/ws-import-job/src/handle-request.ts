/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore } from "@pestras/shared/data-model";
import { injectURLPayload, objUtil } from "@pestras/shared/util";
import { RequestPayload } from "./types";
import axios, { AxiosRequestConfig } from 'axios';
import { wsLogModel } from "./models";

export async function handleRequest(ds: DataStore, payload: RequestPayload, logSerial) {

  await wsLogModel.insertSub(logSerial, 'init http request');

  const reqConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': ds.web_service.content_type,
      'Accept': ds.web_service.accept,
      ...ds.web_service.headers
    } as any
  };

  if (ds.web_service.auth)
    reqConfig.auth = ds.web_service.auth;

  const url = injectURLPayload(ds.web_service.resource_uri, payload.params, payload.search);
  const res = ds.web_service.method === "get"
    ? await axios.get(url, reqConfig)
    : await axios.post(url, reqConfig, payload.body);

  return objUtil.getValueFromPath(ds.web_service.data_path ?? '', res.data);
}