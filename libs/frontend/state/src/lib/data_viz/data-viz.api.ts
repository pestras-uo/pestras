/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataViz } from "@pestras/shared/data-model";

const basePath = '/data-viz';

export namespace DataVizApi {

  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Reponse = BaseDataViz<any> | null; 
  }


  // PUT
  export namespace Create {
    export const REQ_PATH = basePath;

    export type Body = Omit<BaseDataViz<any>, 'create_date' | 'last_modified' | 'serial'>;

    export type Reponse = BaseDataViz<any>; // date 
  }


  // PUT
  export namespace Update {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Body = Omit<BaseDataViz<any>, 'create_date' | 'last_modified'>;

    export type Reponse = string; // date 
  }

}