/* eslint-disable @typescript-eslint/no-namespace */
import { Comment } from "@pestras/shared/data-model";

const basePath = `/comment`;

export namespace CommentsApi {

  // GET
  export namespace GetAll {
     export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export type Response = Comment[];
  }
  
  


  // POST
  export namespace Create {
     export const path = basePath + '/:record';
  
    export interface Params { record: string };

    
    export type Body = Pick<Comment,'record' | 'text'>;
  
    export type Response = string; // date
  }
  
  
  
  // PUT
  export namespace Update {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };

    export type Body = { text: string }
  
    export type Response = string; // date
  }  
  
  
  
  // DELETE
  export namespace Delete {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string; };
  
    export type Response = boolean;
  }
  
}