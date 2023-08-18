/* eslint-disable @typescript-eslint/no-namespace */
import { ContentView, EntityContentViews } from "@pestras/shared/data-model";

const basePath = '/content-views';

export namespace ContentApi {

  // GET
  export namespace GetByEntity {
    export const REQ_PATH = basePath + '/:entity';

    export interface Params { entity: string; }

    export type Response = EntityContentViews | null;
  }


  // POST
  export namespace addView {
    export const REQ_PATH = basePath + '/:entity/views';

    export interface Params { entity: string; }

    export type Body = Omit<ContentView, 'serial'> & { image: File | null };

    export type Response = ContentView;
  }


  // PUT
  export namespace UpdateViewsOrder {
    export const REQ_PATH = basePath + '/:entity/views';

    export interface Params { entity: string; }

    export type Body = { views: string[] };

    export type Response = boolean;
  }


  // PUT
  export namespace UpdateView {
    export const REQ_PATH = basePath + '/:entity/views/:view';

    export interface Params { entity: string; view: string; }

    export type Body = Pick<ContentView, 'title' | 'sub_title'>;

    export type Response = boolean;
  }


  // PUT
  export namespace UpdateViewContent {
    export const REQ_PATH = basePath + '/:entity/views/:view/content';

    export interface Params { entity: string; view: string; }

    export type Body = { content: string | null; image: File | null; };

    export type Response = string | null;
  }


  // DELETE
  export namespace RemoveView {
    export const REQ_PATH = basePath + '/:entity/views/:view';

    export interface Params { entity: string; view: string; }

    export type Response = boolean;
  }
}