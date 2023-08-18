/* eslint-disable @typescript-eslint/no-namespace */
import { RecordWorkflow, WorkflowState } from "@pestras/shared/data-model";

const basePath = '/workflow';

export namespace WorkflowApi {

  // GET
  export namespace GetByRecord {
    export const REQ_PATH = basePath + '/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = RecordWorkflow | null;
  }


  // POST
  export namespace Publish {
    export const REQ_PATH = basePath + '/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = WorkflowState;
  }


  // PUT
  export namespace Approve {
    export const REQ_PATH = basePath + '/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = boolean;
  }


  // PUT
  export namespace Cancel {
    export const REQ_PATH = basePath + '/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = boolean;
  }
}