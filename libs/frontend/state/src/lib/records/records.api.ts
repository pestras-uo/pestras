/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, DataRecord, DataRecordHistroyItem, TableDataRecord } from "@pestras/shared/data-model";
import { basePath } from "../data-stores/data-stores.api";

const localBasePath = `${basePath}/:ds/records`;

export interface DataRecordsSearchResponse {
  count: number;
  results: TableDataRecord[];
}

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

    export type Body = Partial<ApiQuery<any>>;

    export type Response = DataRecordsSearchResponse;
  }

  // POST
  export namespace GetCategoryValues {
    export const REQ_PATH = localBasePath + '/get-category-values';

    export interface Params { ds: string; }

    export interface Body { field: string; search: any; }

    export type Response = string[];
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
    export const REQ_PATH = localBasePath + '/:serial/:draft';

    export interface Params { ds: string; serial: string; draft: number }

    export type Body = DataRecord;

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
  // PUT
  export namespace Delete {
    export const REQ_PATH = localBasePath + '/delete/:serial/:draft';

    export interface Params { ds: string; serial: string; draft: string }

    export interface Body { message: string }

    export type Response = boolean;
  }
}