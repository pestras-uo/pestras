import { GISMapConfig, GISMapFeatureLayer, RegionsApi } from "@pestras/shared/data-model";
import { RegionsModel } from ".";
import { Serial } from "@pestras/shared/util";

export async function addGisMap(
  this: RegionsModel,
  serial: string,
  input: RegionsApi.AddGisMap.Body
) {

  const map: GISMapConfig = {
    serial: Serial.gen("GIS"),
    layers: [],
    ...input
  }

  await this.col.updateOne({ serial }, { $push: { gis: map } });

  return map;
}

export async function updateGisMap(
  this: RegionsModel,
  serial: string,
  mapSerial: string,
  input: RegionsApi.UpdateGisMap.Body
) {

  await this.col.updateOne({ serial, 'gis.serial': mapSerial }, {
    $set: {
      'gis.$.basemap': input.basemap,
      'gis.$.name': input.name,
      'gis.$.id': input.id,
      'gis.$.portal': input.portal
    }
  });

  return true;
}

export async function updateGisMapApiKey(
  this: RegionsModel,
  serial: string,
  mapSerial: string,
  apiKey: string
) {

  await this.col.updateOne({ serial, 'gis.serial': mapSerial }, { $set: { 'gis.$.apiKey': apiKey } });

  return true;
}

export async function removeGisMap(
  this: RegionsModel,
  serial: string,
  mapSerial: string
) {

  await this.col.updateOne({ serial }, { $pull: { gis: { serial: mapSerial } } });

  return true;
}

export async function addGisMapLayer(
  this: RegionsModel,
  serial: string,
  mapSerial: string,
  input: RegionsApi.AddGisMapLayer.Body
) {

  const layer: GISMapFeatureLayer = {
    serial: Serial.gen("LYR"),
    ...input
  }

  await this.col.updateOne({ serial, 'gis.serial': mapSerial }, { $push: { 'gis.$.layers': layer } });

  return layer.serial;
}

export async function updateGisMapLayer(
  this: RegionsModel,
  serial: string,
  mapSerial: string,
  layerSerial: string,
  input: RegionsApi.AddGisMapLayer.Body
) {

  await this.col.updateOne(
    { serial, 'gis.serial': mapSerial },
    {
      $set: {
        'gis.$.layers.$[layer].name': input.name,
        'gis.$.layers.$[layer].id': input.id,
        'gis.$.layers.$[layer].url': input.url,
      }
    },
    { arrayFilters: [{ 'layer.serial': layerSerial }] }
  );

  return true;
}

export async function removeGisMapLayer(
  this: RegionsModel,
  serial: string,
  mapSerial: string,
  layerSerial: string
) {

  await this.col.updateOne({ serial, 'gis.serial': mapSerial }, { $pull: { 'gis.$.layers': { serial: layerSerial } } });

  return true;
}