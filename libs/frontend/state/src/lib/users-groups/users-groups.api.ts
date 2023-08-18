/* eslint-disable @typescript-eslint/no-namespace */
import { UsersGroup } from "@pestras/shared/data-model";

const basePath = '/users-groups';

export namespace UsersGroupsApi {

  export namespace GetAll {
    export const path = basePath;

    export type Response = UsersGroup[];
  }

  export namespace GetBySerial {
    export const path = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = UsersGroup | null;
  }

  export namespace Create {
    export const path = basePath;

    export interface Body { name: string; }

    export type Response = UsersGroup;
  }

  export namespace Update {
    export const path = basePath + '/:serial';

    export interface Params { serial: string; }

    export interface Body { name: string; }

    export type Response = string;  // date
  }

  export namespace Delete {
    export const path = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = boolean;
  }
}