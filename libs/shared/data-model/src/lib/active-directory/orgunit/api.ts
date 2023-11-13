/* eslint-disable @typescript-eslint/no-namespace */

import { Orgunit } from ".";
import { HTTP_METHOD } from "../../util/http";

export namespace OrgunitsApi {
  const basePath = `/orgunits`;



  export namespace GetAll {
    export const REQ_PATH = basePath + '/';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.GET;

    export type Response = Orgunit[];
  }




  export namespace GetBySerial {
    export const REQ_PATH = '/:serial';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.GET;

    export type Params = { serial: string };

    export type Response = Orgunit | null;
  }




  export namespace Create {
    export const REQ_PATH = '/';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.POST;

    export type Body = Pick<Orgunit, 'name' | 'class' | 'regions'> & { parent: string | null; };

    export type Response = Orgunit;
  }



  export namespace Update {
    export const REQ_PATH = '/:serial';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string };

    export type Body = Pick<Orgunit, 'name' | 'class'>;

    export type Response = string | Date; // date
  }



  export namespace UpdateLogo {
    export const REQ_PATH = '/:serial/logo';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string };

    export type Body = { logo: File; }

    export type Response = { path: string; date: string | Date };
  }



  export namespace RemoveLogo {
    export const REQ_PATH = '/:serial/logo';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.DELETE;

    export type Params = { serial: string };

    export type Response = string | Date; // date
  }



  export namespace UpdateRegions {
    export const REQ_PATH = '/:serial/regions';
    export const REQ_FULL_PATH = basePath + REQ_PATH;

    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string };

    export type Body = { regions: string[]; }

    export type Response = string | Date; // date
  }
}