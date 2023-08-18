/* eslint-disable @typescript-eslint/no-namespace */
import { Orgunit } from "@pestras/shared/data-model";

const basePath = `/orgunits`;

export namespace OrgunitsApi {
  
  // GET
  export namespace GetAll {
    export const path = basePath + '';
  
    export type Response = Orgunit[];
  }
  
  
  
  // GET
  export namespace GetBySerial {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export type Response = Orgunit | null;
  }
  
  
  
  // POST
  export namespace Create {
    export const path = basePath + '';
  
    export interface Body {
      name: string;
      regions: string[];
      parent: string | null;
      class: string;
    }
  
    export type Response = Orgunit;
  }
  
  
  
  // PUT
  export namespace Update {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export interface Body {
      regions: string[];
      name: string;
      class: string;
    }
  
    export type Response = string; // date
  }
  
  
  
  // PUT
  export namespace UpdateLogo {
    export const path = basePath + '/:serial/logo';
  
    export interface Params { serial: string };
  
    export interface Body { logo: File; }
  
    export type Response = { path: string; };
  }
  
  
  
  // DELETE
  export namespace RemoveLogo {
    export const path = basePath + '/:serial/logo';
  
    export interface Params { serial: string };
  
    export type Response = string; // date
  }
}
