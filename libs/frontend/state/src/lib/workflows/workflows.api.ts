import { CreateWorkflowInput } from "@pestras/backend/models";
import { Workflow, WorkflowAction, WorkflowStepOptions } from "@pestras/shared/data-model";

/* eslint-disable @typescript-eslint/no-namespace */
const basePath = '/workflows';

export namespace WorkflowsApi {
  

  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Workflow | null;
  }

  // GET
  export namespace GetByBlueprint {
    export const REQ_PATH = basePath + '/blueprint/:blueprint';

    export interface Params { blueprint: string; }

    export type Response = Workflow[];
  }

  // POST
  export namespace Create {
    export const REQ_PATH = basePath;

    export type Body = CreateWorkflowInput;

    export type Response = Workflow;
  }

  // PUT
  export namespace UpdateName {
    export const REQ_PATH = basePath + '/:serial/name';

    export interface Params { serial: string; }

    export interface Body { name: string; };

    export type Response = boolean;
  }

  // PUT
  export namespace UpdateMaxReviewDays {
    export const REQ_PATH = basePath + '/:serial/max-review-days';

    export interface Params { serial: string; }

    export interface Body { days: number; };

    export type Response = boolean;
  }

  // PUT
  export namespace UpdateDefaultAction {
    export const REQ_PATH = basePath + '/:serial/default-action';

    export interface Params { serial: string; }

    export interface Body { action: Exclude<WorkflowAction, WorkflowAction.REVIEW>; };

    export type Response = boolean;
  }

  // PUT
  export namespace UpdateCancelable {
    export const REQ_PATH = basePath + '/:serial/cancelable';

    export interface Params { serial: string; }

    export interface Body { cancelable: boolean; };

    export type Response = boolean;
  }

  // PUT
  export namespace UpdateSteps {
    export const REQ_PATH = basePath + '/:serial/steps';

    export interface Params { serial: string; }

    export interface Body { steps: WorkflowStepOptions[]; };

    export type Response = boolean;
  }
}