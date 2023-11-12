import { SubDataStoreChart, SubDataStore } from "@pestras/shared/data-model";
import { DataStoresModel } from ".";
import { Serial } from "@pestras/shared/util";


// Add Relation
// --------------------------------------------------------------------------------------
export type AddRelationInput = Pick<SubDataStore, 'name' | 'data_store' | 'on'>;

export async function addRelation(
  this: DataStoresModel,
  serial: string,
  input: AddRelationInput
) {

  const relation: SubDataStore = {
    serial: Serial.gen("REL"),
    charts: [],
    charts_order: [],
    ...input
  };

  await this.col.updateOne({ serial }, { $push: { relateions: relation } });

  return relation;
}

// Update Relation
// --------------------------------------------------------------------------------------
export type UpdateRelationInput = Pick<SubDataStore, 'name' | 'on'>;

export async function updateRelation(
  this: DataStoresModel,
  serial: string,
  rSerial: string,
  input: UpdateRelationInput
) {
  await this.col.updateOne({ serial, 'relateions.serial': rSerial }, {
    $set: {
      'relateions.$.name': input.name,
      'relateions.$.on': input.on
    }
  });

  return true;
}

// Add Relation Chart
// --------------------------------------------------------------------------------------
export type AddRelationChartInput = Omit<SubDataStoreChart, 'serial'>;

export async function addRelationChart(
  this: DataStoresModel,
  serial: string,
  rSerial: string,
  input: AddRelationChartInput
) {
  const chart: SubDataStoreChart = {
    serial: Serial.gen("VIZ"),
    ...input
  };

  await this.col.updateOne({ serial, 'relateions.serial': rSerial }, {
    $push: {
      'relateions.$.charts_order': chart.serial,
      'relateions.$.charts': chart
    }
  });

  return serial;
}

// Update Relation Chart
// --------------------------------------------------------------------------------------
export type UpdateRelationChartInput = Pick<SubDataStoreChart, 'title' | 'width' | 'height'>;

export async function updateRelationChart(
  this: DataStoresModel,
  serial: string,
  rSerial: string,
  cSerial: string,
  input: UpdateRelationChartInput
) {

  await this.col.updateOne(
    { serial, 'relateions.serial': rSerial },
    {
      $set: {
        'relateions.$.charts.$[chart].title': input.title,
        'relateions.$.charts.$[chart].width': input.width,
        'relateions.$.charts.$[chart].height': input.height
      }
    },
    { arrayFilters: [{ 'chart.serial': cSerial }] }
  );

  return true;
}

// Update Relation Chart
// --------------------------------------------------------------------------------------
export async function reorderRelationCharts(
  this: DataStoresModel,
  serial: string,
  rSerial: string,
  order: string[]
) {

  await this.col.updateOne(
    { serial, 'relateions.serial': rSerial },
    { $set: { 'relateions.$.charts_order': order } }
  );

  return true;
}

// Remove Relation Chart
// --------------------------------------------------------------------------------------
export async function removeRelationChart(
  this: DataStoresModel,
  serial: string,
  rSerial: string,
  cSerial: string
) {

  await this.col.updateOne(
    { serial, 'relateions.serial': rSerial },
    {
      $pull: {
        'relateions.$.charts_order': cSerial,
        'relateions.$.charts': { serial: cSerial },
      }
    }
  );

  return true;
}

// Remove Relation
// --------------------------------------------------------------------------------------
export async function removeRelation(
  this: DataStoresModel,
  serial: string,
  rSerial: string
) {

  await this.col.updateOne(
    { serial },
    { $pull: { relateions: { serial: rSerial } } }
  );

  return true;
}