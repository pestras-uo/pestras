/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore } from "@pestras/shared/data-model";
import { injectURLPayload, objUtil } from "@pestras/shared/util";
import { RequestPayload } from "./types";
import axios, { AxiosRequestConfig } from 'axios';

export async function generateWebServiceRequest(ds: DataStore, payload: RequestPayload) {

  const settings = ds.web_service;

  if (!settings)
    throw new Error("dataStore web service settings not found")

  const reqConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': settings.content_type,
      'Accept': settings.accept,
      ...settings.headers
    } as any
  };

  if (settings.auth)
    reqConfig.auth = settings.auth;

  const url = injectURLPayload(settings.resource_uri, payload.params, payload.search);
  const res = settings.method === "get"
    ? await axios.get(url, reqConfig)
    : await axios.post(url, reqConfig, payload.body);

  return objUtil.getValueFromPath(settings.data_path ?? '', res.data);
}