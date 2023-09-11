/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStore } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { Db } from "mongodb";
import { exists, getByBlueprint, getBySerial, getFields, search } from "./read";
import { create } from "./create";
import { update, updateState } from "./update";
import { setTableSettings } from "./settings";
import { addQueryOption, addSelection, removeQueryOption, removeSelection, setHeader, setWebServiceAuth, setWebServiceConfig } from "./web-service";
import { setAggregation } from "./aggregation";
import { addField, removeField, setFieldConstraint, updateField, updateFieldConfig } from "./fields";
import { addCollaborator, removeCollaborator } from "./collaborators";
import { setActivation } from "./activation";
import { build, buildView } from "./build";

export { CreateDataStoreInput } from './create';
export { SetWebServiceConfigInput } from './web-service';
export { UpdateFieldConfigInput, UpdateFieldInput } from './fields';

export class DataStoresModel extends Model<DataStore> {
  protected dataDB!: Db;

  protected override init(): void {
    this.pubSub.on<Db>('data-db-connected', db => this.dataDB = db);
  }

  // read
  // ---------------------------------------------------------------------------------------
  getByBlueprint = getByBlueprint.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<DataStore> = getBySerial.bind(this);
  search = search.bind(this);

  // util
  // ---------------------------------------------------------------------------------------
  exists = exists.bind(this);
  getFields = getFields.bind(this);

  // create data store
  // ---------------------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // --------------------------------------------------------------------------------------
  update = update.bind(this);
  updateState = updateState.bind(this);
  build = build.bind(this);
  buildView = buildView.bind(this);

  // Template Settings
  // --------------------------------------------------------------------------------------
  setTableSettings = setTableSettings.bind(this);

  // Web Serive
  // --------------------------------------------------------------------------------------
  setWebServiceConfig = setWebServiceConfig.bind(this);
  setWebServiceAuth = setWebServiceAuth.bind(this);
  setHeader = setHeader.bind(this);
  addQueryOption = addQueryOption.bind(this);
  removeQueryOption = removeQueryOption.bind(this);
  addSelection = addSelection.bind(this);
  removeSelection = removeSelection.bind(this);

  // Aggregation
  // --------------------------------------------------------------------------------------
  setAggregation = setAggregation.bind(this);

  // fields
  // --------------------------------------------------------------------------------------
  addField = addField.bind(this);
  updateField = updateField.bind(this);
  updateFieldConfig = updateFieldConfig.bind(this);
  setFieldConstraint = setFieldConstraint.bind(this);
  removeField = removeField.bind(this);

  // collaborators
  // ---------------------------------------------------------------------------------
  addCollaborator = addCollaborator.bind(this);
  removeCollaborator = removeCollaborator.bind(this);

  // update activation
  // --------------------------------------------------------------------------------------
  setActivation = setActivation.bind(this);
}