/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, DataRecord } from "@pestras/shared/data-model";
import { basePath } from "../data-stores/data-stores.api";

const localBasePath = `${basePath}/:ds/records`;

export namespace RecordsApi {

  // read
  // --------------------------------------------------------------------------------------
  // GET
  export namespace GetBySerial {
    export const REQ_PATH = `${localBasePath}/:serial`;

    export interface Params { ds: string; serial: string; }

    export type Response<T = DataRecord> = T | null;
  }

  // POST
  export namespace Search {
    export const REQ_PATH = localBasePath + '/search';

    export interface Params { ds: string; }

    export type Body = ApiQuery<any>;

    export type Response<T = DataRecord> = { count: number; results: T[]; };
  }


  // create
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Create {
    export const REQ_PATH = localBasePath;

    export interface Params { ds: string; }

    export type Body = any;

    export type Response<T = DataRecord> = T;
  }


  // update
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Update {
    export const REQ_PATH = localBasePath + '/:serial';

    export interface Params { ds: string; serial: string; }

    export interface Body  { group: string; data: any; };

    export type Response<T = DataRecord> = T;
  }


  // DELETE
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Delete {
    export const REQ_PATH = localBasePath + '/:serial';

    export interface Params { ds: string; serial: string; }

    export type Response = boolean;
  }
}