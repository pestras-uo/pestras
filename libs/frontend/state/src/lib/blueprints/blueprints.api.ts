/* eslint-disable @typescript-eslint/no-namespace */
import { Blueprint } from "@pestras/shared/data-model";

const basePath = '/blueprints';

export namespace BlueprintsApi {

  // GET
  export namespace GetAll {
    export const REQ_PATH = basePath;

    export type Response = Blueprint[];
  }

  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Blueprint | null;
  }



  // POST
  export namespace Create {
    export const REQ_PATH = basePath;

    export interface Body { name: string; }

    export type Response = Blueprint;
  }



  // POST
  export namespace Update {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export interface Body { name: string; }

    export type Response = string; // date
  }



  // POST
  export namespace AddCollaborator {
    export const REQ_PATH = `${basePath}/:serial/collaborators/:collaborator`;

    export interface Params { serial: string; collaborator: string; }

    export type Response = string; // date
  }



  // DELETE
  export namespace RemoveCollaborator {
    export const REQ_PATH = `${basePath}/:serial/collaborators/:collaborator`;

    export interface Params { serial: string; collaborator: string; }

    export type Response = string; // date
  }
}