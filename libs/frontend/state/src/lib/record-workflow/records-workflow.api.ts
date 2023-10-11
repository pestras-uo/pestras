/* eslint-disable @typescript-eslint/no-namespace */
import { DataRecordState, RecordWorkflow, RecordWorkflowState, WorkflowTriggers } from "@pestras/shared/data-model";

const basePath = '/records-workflow';

export namespace RecordsWorkflowApi {

  // GET
  export namespace GetByRecord {
    export const REQ_PATH = basePath + '/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = RecordWorkflowState;
  }

  // GET
  export namespace GetRecordState {
    export const REQ_PATH = basePath + '/state/:ds/:record';

    export interface Params { ds: string; record: string; }

    export type Response = RecordWorkflow | null;
  }


  // POST
  export namespace Publish {
    export const REQ_PATH = basePath + '/:ds/:record/:trigger';

    export interface Params { ds: string; record: string; trigger: WorkflowTriggers }

    export interface Body { message: string; }

    export type Response = boolean;
  }


  // PUT
  export namespace Approve {
    export const REQ_PATH = basePath + '/approve/:ds/:record/:step';

    export interface Params { ds: string; record: string, step: string; }

    export interface Body { message: string; }

    export type Response = DataRecordState | null;
  }


  // PUT
  export namespace Reject {
    export const REQ_PATH = basePath + '/reject/:record/:ds/:step';

    export interface Params { ds: string; record: string; step: string; }

    export interface Body { message: string; }

    export type Response = DataRecordState;
  }
}