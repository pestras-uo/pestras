/* eslint-disable @typescript-eslint/no-namespace */
import { Category } from "@pestras/shared/data-model";

const basePath = `/categories`;

export namespace CategoriesApi {

  // GET
  export namespace GetByParent {
    export const path = basePath + '/parent/:serial/level/:level';
  
    export interface Params { serial: string; level: number };
  
    export type Response = Category[];
  }

  // GET
  export namespace GetByValue {
    export const path = basePath + '/parent/:parent/value/:value';
  
    export interface Params { parent: string; value: number; }
  
    export type Response = Category | null;
  }
  
  
  
  // GET
  export namespace GetBySerial {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export type Response = Category | null;
  }
  
    
  
  // GET
  export namespace GetByBlueprint {
    export const path = basePath + '/blueprint/:blueprint';
  
    export interface Params { blueprint: string };
  
    export type Response = Category[];
  }
  
  
  
  
  // POST
  export namespace Create {
    export const path = basePath + '';
  
    export type Body = Pick<Category, 'title' | 'blueprint' | 'type' | 'value' | 'levels'> & { parent: string | null };
  
    export type Response = Category;
  }
  
  
  
  
  // PUT
  export namespace Update {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export type Body = Pick<Category, 'title' | 'value' | 'type'>;
  
    export type Response = string; // date
  }  
  
  
  
  // DELETE
  export namespace Delete {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string; };
  
    export type Response = boolean;
  }
  
}