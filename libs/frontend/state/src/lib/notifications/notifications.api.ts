import { Notification } from "@pestras/shared/data-model";

/* eslint-disable @typescript-eslint/no-namespace */
const basePath = '/notifications';

export namespace NotificationsApi {

  // GET
  export namespace GetAll {
    export const REQ_PATH = basePath;
    
    export type Response = Notification[];
  }

  // PUT
  export namespace SetSeen {
    export const REQ_PATH = basePath + '/:serial/seen';

    export interface Params { serial: string; };

    export type Response = string; // date
  }
}