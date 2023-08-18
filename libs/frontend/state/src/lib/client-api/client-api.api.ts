/* eslint-disable @typescript-eslint/no-namespace */
import { ClientApi, ClientApiDataStore, ClientApiDataStoreParam } from "@pestras/shared/data-model";

const basePath = `/client-api`;

export namespace ClientApiApi {

  // GET
  export namespace GetByBlueprint {
    export const path = basePath + '/blueprint/:blueprint';
  
    export interface Params { blueprint: string; };
  
    export type Response = ClientApi[];
  }

  // GET
  export namespace GetBySerial {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string; };
  
    export type Response = ClientApi | null;
  }



  // POST
  export namespace Create {
    export const path = basePath;
  
    export interface Body { client_name: string; blueprint: string; };
  
    export type Response = ClientApi;
  }




  // PUT
  export namespace Update {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string };
  
    export interface Body { client_name: string };
  
    export type Response = string; // date
  }



  // POST
  export namespace AddIP {
    export const path = basePath + '/:serial/ips';
  
    export interface Params { serial: string };
  
    export interface Body { ip: string };
  
    export type Response = string;  // date
  }

  // DELETE
  export namespace RemoveIP {
    export const path = basePath + '/:serial/ips';
  
    export interface Params { serial: string };
  
    export interface Body { ip: string };
  
    export type Response = string;  // date
  }



  // POST
  export namespace AddDataStore {
    export const path = basePath + '/:serial/data-stores/:ds';
  
    export interface Params { serial: string; ds: string; };
  
    export type Body = Pick<ClientApiDataStore, 'max' | 'method' | 'topic'>;
  
    export type Response = string;  // date
  }

  // PUT
  export namespace UpdateDataStore {
    export const path = basePath + '/:serial/data-stores/:ds';
  
    export interface Params { serial: string; ds: string; };
  
    export type Body = Pick<ClientApiDataStore, 'max' | 'method' | 'topic'>;
  
    export type Response = string;  // date
  }

  // DELETE
  export namespace RemoveDataStore {
    export const path = basePath + '/:serial/data-stores/:ds';
  
    export interface Params { serial: string; ds: string; };
  
    export type Response = string;  // date
  }




  // POST
  export namespace AddParam {
    export const path = basePath + '/:serial/data-stores/:ds/params';
  
    export interface Params { serial: string; ds: string; };
  
    export type Body = Omit<ClientApiDataStoreParam, 'serial'>;
  
    export interface Response { param: ClientApiDataStoreParam; date: string; }  // date
  }

  // PUT
  export namespace UpdateParam {
    export const path = basePath + '/:serial/data-stores/:ds/params/:param';
  
    export interface Params { serial: string; ds: string; param: string; };
  
    export type Body = Omit<ClientApiDataStoreParam, 'serial'>;
  
    export type Response = string;  // date
  }

  // DELETE
  export namespace RemoveParam {
    export const path = basePath + '/:serial/data-stores/:ds/params/:param';
  
    export interface Params { serial: string; ds: string; param: string; };
  
    export type Response = string;  // date
  }




  // DELETE
  export namespace Delete {
    export const path = basePath + '/:serial';
  
    export interface Params { serial: string; };
  
    export type Response = boolean;
  }
}