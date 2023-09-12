/* eslint-disable @typescript-eslint/no-namespace */
import { Topic } from "@pestras/shared/data-model";

const basePath = '/topics';

export namespace TopicsApi {

  // GET
  export namespace GetByParent {
    export const REQ_PATH = basePath + '/parent/:parent?';

    export interface Params { parent: string | null; }

    export type Response = Topic[];
  }

  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Topic | null;
  }




  // POST
  export namespace Create {
    export const REQ_PATH = basePath;

    export type Body  = Pick<Topic, 'blueprint' | 'parent' | 'name'>;

    export type Response = Topic;
  }

  // PUT
  export namespace Update {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Body = Pick<Topic, 'name'>;

    export type Response = string; // date
  }
}