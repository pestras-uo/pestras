/* eslint-disable @typescript-eslint/no-namespace */
import { Category } from "@pestras/shared/data-model";

const basePath = `/categories`;

export namespace CategoriesApi {

  // GET
  export namespace GetAll {
    export const path = basePath + '';
  
    export type Response = Category[];
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
  
    export type Body = Pick<Category, 'title' | 'blueprint' | 'ordinal' | 'value'> & { parent: string | null };
  
    export type Response = Category;
  }
  
  
  
  
  // PUT
  export namespace Update {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export type Body = Pick<Category, 'title' | 'value' | 'ordinal'>;
  
    export type Response = string; // date
  }  
  
  
  
  // DELETE
  export namespace Delete {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string; };
  
    export type Response = boolean;
  }
  
}