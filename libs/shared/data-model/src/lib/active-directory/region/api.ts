/* eslint-disable @typescript-eslint/no-namespace */
import { GISMapConfig, GISMapFeatureLayer, Region, RegionCoords } from ".";
import { HTTP_METHOD } from "../../util/http";

export namespace RegionsApi {
  const basePath = `/regions`;

  // read
  // ------------------------------------------------------------------------------------
  export namespace GetAll {
    export const REQ_PATH = "/";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.GET;

    export type Response = Region[];
  }

  export namespace GetBySerial {
    export const REQ_PATH = "/:serial";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.GET;

    export type Params = { serial: string; }
    export type Response = Region | null;
  }

  // create modify region
  // ------------------------------------------------------------------------------------
  export namespace Create {
    export const REQ_PATH = "/";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.POST;

    export type Body = Pick<Region, 'name' | 'type' | 'location' | 'zoom'> & { parent: string; }
    export type Response = Region;
  }

  export namespace Update {
    export const REQ_PATH = "/:serial";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string; }
    export type Body = Pick<Region, 'name' | 'type' | 'location' | 'zoom'>;
    export type Response = string | Date; // date
  }

  // update boundry coords
  // ------------------------------------------------------------------------------------
  export namespace UpdateCoords {
    export const REQ_PATH = "/:serial/coords";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string; }
    export type Body = RegionCoords;
    export type Response = string | Date; // date
  }

  // Gis Maps
  // ------------------------------------------------------------------------------------
  export namespace AddGisMap {
    export const REQ_PATH = "/:serial/gis-map";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.POST;

    export type Params = { serial: string; }
    export type Body = Pick<GISMapConfig, 'name' | 'apiKey' | 'basemap' | 'id' | 'portal'>;
    export type Response = GISMapConfig;
  }

  export namespace UpdateGisMap {
    export const REQ_PATH = "/:serial/gis-map/:map";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string; map: string; }
    export type Body = Pick<GISMapConfig, 'name' | 'apiKey' | 'basemap' | 'id' | 'portal'>;
    export type Response = boolean;
  }

  export namespace RemoveGisMap {
    export const REQ_PATH = "/:serial/gis-map/:map";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.DELETE;

    export type Params = { serial: string; map: string; }
    export type Response = boolean;
  }
  
  // Gis Maps Layers
  // ------------------------------------------------------------------------------------
  export namespace AddGisMapLayer {
    export const REQ_PATH = "/:serial/gis-map/:map/layers";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.POST;

    export type Params = { serial: string; map: string; }
    export type Body = Pick<GISMapFeatureLayer, 'name' | 'id' | 'url'>;
    export type Response = string; // serial
  }

  export namespace UpdateGisMapLayer {
    export const REQ_PATH = "/:serial/gis-map/:map/layers/:layer";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.PUT;

    export type Params = { serial: string; map: string; layer: string; }
    export type Body = Pick<GISMapFeatureLayer, 'name' | 'id' | 'url'>;
    export type Response = boolean;
  }

  export namespace RemoveGisMapLayer {
    export const REQ_PATH = "/:serial/gis-map/:map/layers/:layer";
    export const REQ_FULL_PATH = basePath + REQ_PATH;
    export const REQ_METHOD = HTTP_METHOD.DELETE;

    export type Params = { serial: string; map: string; layer: string; }
    export type Response = boolean;
  }
}