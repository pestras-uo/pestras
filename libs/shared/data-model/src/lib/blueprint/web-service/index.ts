import { Interval } from "../../util";
import { WSQueryOptions } from "./query-options";
import { WebServiceSelection } from "./selection";

export * from './analyse-data-types';
export * from './query-options';
export * from './selection';

export interface WSAuth {
  username: string;
  password: string;
}

export enum WSContentType {
  JSON = 'application/json',
  URLENCODED = 'application/x-www-form-urlencoded'
}

export enum WSAccept {
  JSON = 'application/json',
  XML = 'text/xml',
  CSV = 'text/csv'
}


// TODO: add secrets
export interface WebServiceConfig {
  initialized: boolean;
  make_init_request: boolean;
  resource_uri: string;
  method: 'get' | 'post';
  content_type: WSContentType;
  accept: WSAccept;
  auth: WSAuth | null;
  headers: { key: string; value: string; }[];
  payload: WSQueryOptions[];
  data_path: string | null;
  replace_existing: boolean;
  // data store records update periods
  intervals: Interval;
  fetch_day: number;
  selection: WebServiceSelection[];
}