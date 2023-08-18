/* eslint-disable @typescript-eslint/no-namespace */
import { Region, RegionCoords } from "@pestras/shared/data-model";

const basePath = `/regions`;

export namespace RegionsApi {

  export namespace GetAll {
    export const path = basePath + "";
  
    export type Response = Region[];
  }
  
  export namespace GetBySerial {
    export const path = basePath + "/:serial";
  
    export interface Params { serial: string; }
  
    export type Response = Region | null;
  }
  
  export namespace Create {
    export const path = basePath + "";
  
    export type Body = Pick<Region, 'name' | 'type' | 'location' | 'zoom'> & { parent: string; }
  
    export type Response = Region;
  }
  
  export namespace Update {
    export const path = basePath + "/:serial";
  
    export interface Params { serial: string; }
  
    export type Body = Pick<Region, 'name' | 'type' | 'location' | 'zoom'>;
  
    export type Response = string; // date
  }
  
  export namespace UpdateCoords {
    export const path = basePath + "/:serial/coords";
  
    export interface Params { serial: string; }
  
    export type Body = RegionCoords;
  
    export type Response = string; // date
  }
}

