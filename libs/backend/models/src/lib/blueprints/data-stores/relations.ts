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

  await this.col.updateOne({ serial }, { $push: { relations: relation } });

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
  await this.col.updateOne({ serial, 'relations.serial': rSerial }, {
    $set: {
      'relations.$.name': input.name,
      'relations.$.on': input.on
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

  await this.col.updateOne({ serial, 'relations.serial': rSerial }, {
    $push: {
      'relations.$.charts_order': chart.serial,
      'relations.$.charts': chart
    }
  });

  return chart.serial;
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
    { serial, 'relations.serial': rSerial },
    {
      $set: {
        'relations.$.charts.$[chart].title': input.title,
        'relations.$.charts.$[chart].width': input.width,
        'relations.$.charts.$[chart].height': input.height
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
    { serial, 'relations.serial': rSerial },
    { $set: { 'relations.$.charts_order': order } }
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
    { serial, 'relations.serial': rSerial },
    {
      $pull: {
        'relations.$.charts_order': cSerial,
        'relations.$.charts': { serial: cSerial },
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
    { $pull: { relations: { serial: rSerial } } }
  );

  return true;
}