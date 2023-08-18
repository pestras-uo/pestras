/* eslint-disable @typescript-eslint/no-namespace */
import { Workspace, WorkspaceDashboardSlide, WorkspacePin } from "@pestras/shared/data-model";

const basePath = '/workspaces';

export namespace WorkspaceApi {

  export namespace GetByOwner {
    export const REQ_PATH = basePath;

    export type Response = Workspace | null;
  }

  export namespace AddGroup {
    export const REQ_PATH = basePath + '/groups';

    export interface Body { name: string; };

    export type Response = string; // serial
  }

  export namespace UpdateGroup {
    export const REQ_PATH = basePath + '/groups/:group';

    export interface Params { group: string; };

    export interface Body { name: string; };

    export type Response = boolean;
  }

  export namespace RemoveGroup {
    export const REQ_PATH = basePath + '/groups/:group';

    export interface Params { group: string; };

    export type Response = boolean;
  }

  export namespace AddPin {
    export const REQ_PATH = basePath + '/pins';

    export type Body = WorkspacePin;

    export type Response = boolean; // serial
  }

  export namespace RemovePin {
    export const REQ_PATH = basePath + '/pins/:pin';

    export interface Params { pin: string; };

    export type Response = boolean;
  }

  export namespace AddSlide {
    export const REQ_PATH = basePath + '/slides';

    export type Body = WorkspaceDashboardSlide;

    export type Response = boolean;
  }

  export namespace RemoveSlide {
    export const REQ_PATH = basePath + '/slides/:slide';

    export interface Params { slide: string; };

    export type Response = boolean;
  }
}