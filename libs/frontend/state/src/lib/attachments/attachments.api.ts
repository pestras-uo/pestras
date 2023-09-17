/* eslint-disable @typescript-eslint/no-namespace */
import { Attachment } from "@pestras/shared/data-model";

const basePath = '/attachments';

export namespace AttachmentsApi {

  // GET
  export namespace GetBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = Attachment | null;
  }


  // GET
  export namespace GetByEntity {
    export const REQ_PATH = basePath + '/entity/:entity';

    export interface Params { entity: string; }

    export type Response = Attachment[];
  }


  // POST
  export namespace Create {
    export const REQ_PATH = basePath + '';

    export type Body = Pick<Attachment, 'entity' | 'name' | 'parent'> & { attachment: File }

    export type Response = Attachment;
  }


  // PUT
  export namespace UpdateName {
    export const REQ_PATH = basePath + '/:serial/name';

    export interface Params { serial: string; }

    export type Body = { name: string }

    export type Response = boolean;
  }


  // DELETE
  export namespace RemoveBySerial {
    export const REQ_PATH = basePath + '/:serial';

    export interface Params { serial: string; }

    export type Response = boolean;
  }
}