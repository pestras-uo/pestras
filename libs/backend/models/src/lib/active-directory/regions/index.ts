import { GISMapConfig, Region, RegionsApi } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { getAll, getBySerial } from "./read";
import { nameExists } from "./util";
import { create } from "./create";
import { update, updateCoords } from "./update";
import { addGisMap, addGisMapLayer, removeGisMap, removeGisMapLayer, updateGisMap, updateGisMapApiKey, updateGisMapLayer } from "./gis";

export class RegionsModel extends Model<Region> {

  // getters
  // -----------------------------------------------------------------------------------
  getAll: (projection?: unknown) => Promise<Region[]> = getAll.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<Region | null> = getBySerial.bind(this);

  // util
  // ------------------------------------------------------------------------------------
  nameExists: (name: string, exclude?: string) => Promise<boolean> = nameExists.bind(this);

  // create, update
  // ------------------------------------------------------------------------------------
  create: (data: RegionsApi.Create.Body, issuer: string) => Promise<Region> = create.bind(this);
  update: (serial: string, input: RegionsApi.Update.Body, issuer: string) => Promise<Date> = update.bind(this);

  // update coordsd
  // ------------------------------------------------------------------------------------
  updateCoords: (serial: string, input: RegionsApi.UpdateCoords.Body, issuer: string) => Promise<Date> = updateCoords.bind(this);

  // gis maps
  // ------------------------------------------------------------------------------------
  addGisMap: (serial: string, input: RegionsApi.AddGisMap.Body) => Promise<GISMapConfig> = addGisMap.bind(this);
  updateGisMap: (serial: string, mapSerial: string, input: RegionsApi.UpdateGisMap.Body) => Promise<boolean> = updateGisMap.bind(this);
  updateGisMapApiKey: (serial: string, mapSerial: string, apiKey: string) => Promise<boolean> = updateGisMapApiKey.bind(this);
  removeGisMap: (serial: string, mapSerial: string) => Promise<boolean> = removeGisMap.bind(this);

  // gis maps layers
  // ------------------------------------------------------------------------------------
  addGisMapLayer: (serial: string, mapSerial: string, input: RegionsApi.AddGisMapLayer.Body) => Promise<string> = addGisMapLayer.bind(this);
  updateGisMapLayer: (serial: string, mapSerial: string, layerSerial: string, input: RegionsApi.UpdateGisMapLayer.Body) => Promise<boolean> = updateGisMapLayer.bind(this);
  removeGisMapLayer: (serial: string, mapSerial: string, layerSerial: string) => Promise<boolean> = removeGisMapLayer.bind(this);
}