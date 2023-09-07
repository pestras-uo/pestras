/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, DataRecordHistroyItem, TableDataRecord } from "@pestras/shared/data-model";
import { basePath } from "../data-stores/data-stores.api";

const localBasePath = `${basePath}/:ds/records`;

export namespace RecordsApi {

  // read
  // --------------------------------------------------------------------------------------
  // GET
  export namespace GetBySerial {
    export const REQ_PATH = `${localBasePath}/:serial`;

    export interface Params { ds: string; serial: string; }

    export type Response = TableDataRecord | null;
  }

  // POST
  export namespace Search {
    export const REQ_PATH = localBasePath + '/search';

    export interface Params { ds: string; }

    export type Body = ApiQuery<any>;

    export type Response = { count: number; results: TableDataRecord[]; };
  }

  // GET
  export namespace getHistory {
    export const REQ_PATH = localBasePath + '/:record/histroy';

    export interface Params { ds: string; record: string; }

    export type Response = DataRecordHistroyItem[];
  }


  // create
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Create {
    export const REQ_PATH = localBasePath;

    export interface Params { ds: string; }

    export type Body = any;

    export type Response = TableDataRecord;
  }


  // update
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Update {
    export const REQ_PATH = localBasePath + '/:serial';

    export interface Params { ds: string; serial: string; }

    export interface Body  { group: string; data: any; };

    export type Response = TableDataRecord;
  }


  // history
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace RevertHistory {
    export const REQ_PATH = localBasePath + '/history/:history/revert';

    export interface Params { ds: string; history: string; }

    export type Response = TableDataRecord;
  }


  // delete
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Delete {
    export const REQ_PATH = localBasePath + '/:serial';

    export interface Params { ds: string; serial: string; }

    export type Response = boolean;
  }
}