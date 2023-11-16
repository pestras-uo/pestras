/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregationDataStoreConfig, DataStore, DataStoreSettings, DataStoreState, Field, SubDataStore, User, ValueConstraint, WSAuth, WSQueryOptions, WebServiceSelection } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { Db } from "mongodb";
import { exists, getByBlueprint, getBySerial, getFields, search } from "./read";
import { create, CreateDataStoreInput } from "./create";
import { update, updateState } from "./update";
import { setTableSettings } from "./settings";
import { addQueryOption, addSelection, removeQueryOption, removeSelection, setHeader, setWebServiceAuth, setWebServiceConfig, SetWebServiceConfigInput } from "./web-service";
import { setAggregation } from "./aggregation";
import { addField, removeField, setFieldConstraint, updateField, updateFieldConfig, UpdateFieldConfigInput, UpdateFieldInput } from "./fields";
import { addCollaborator, removeCollaborator } from "./collaborators";
import { setActivation } from "./activation";
import { build, buildView } from "./build";
import { AddRelationChartInput, AddRelationInput, UpdateRelationChartInput, UpdateRelationInput, addRelation, addRelationChart, removeRelation, removeRelationChart, reorderRelationCharts, updateRelation, updateRelationChart } from "./relations";

export { 
  CreateDataStoreInput, 
  SetWebServiceConfigInput, 
  UpdateFieldConfigInput, 
  UpdateFieldInput,
  AddRelationChartInput,
  AddRelationInput,
  UpdateRelationChartInput,
  UpdateRelationInput
};

export class DataStoresModel extends Model<DataStore> {
  protected dataDB!: Db;

  protected override init(): void {
    this.channel.on<Db>('data-db-connected', db => this.dataDB = db);
  }

  // read
  // ---------------------------------------------------------------------------------------
  getByBlueprint: (bp: string) => Promise<DataStore[]> = getByBlueprint.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<DataStore | null> = getBySerial.bind(this);
  search: (query: any, skip: number, limit: number, projection: any) => any = search.bind(this);

  // util
  // ---------------------------------------------------------------------------------------
  exists: (serial: string) => Promise<boolean> = exists.bind(this);
  getFields: (serial: string) => Promise<Field[]> = getFields.bind(this);

  // create data store
  // ---------------------------------------------------------------------------------------
  create: (data: CreateDataStoreInput, issuer: User) => Promise<DataStore> = create.bind(this);

  // update
  // --------------------------------------------------------------------------------------
  update: (serial: string, name: string, issuer: User) => Promise<Date> = update.bind(this);
  updateState: (serial: string, state: Exclude<DataStoreState, DataStoreState.BUILD>) => Promise<Date> = updateState.bind(this);
  async updateWsState(serial: string, state: DataStoreState, initialized: boolean) {
    return this.col.updateOne({ serial }, {
      $set: {
        state,
        'web_service.initialized': initialized,
        last_modified: new Date()
      }
    });
  }
  build: (serial: string, issuer: User) => Promise<boolean> = build.bind(this);
  buildView: (ds: DataStore, rebuild?: boolean) => Promise<void> = buildView.bind(this);

  // Template Settings
  // --------------------------------------------------------------------------------------
  setTableSettings: (serial: string, settings: DataStoreSettings, issuer: User) => Promise<Date> = setTableSettings.bind(this);

  // Web Serive
  // --------------------------------------------------------------------------------------
  setWebServiceConfig: (serial: string, input: SetWebServiceConfigInput, issuer: User) => Promise<Date> = setWebServiceConfig.bind(this);
  setWebServiceAuth: (serial: string, auth: WSAuth | null, issuer: User) => Promise<Date> = setWebServiceAuth.bind(this);
  setHeader: (serial: string, header: { key: string; value?: string | null; }, issuer: User) => Promise<Date> = setHeader.bind(this);
  addQueryOption: (serial: string, options: WSQueryOptions, issuer: User) => Promise<{ option: WSQueryOptions; date: Date; }> = addQueryOption.bind(this);
  removeQueryOption: (serial: string, option: string, issuer: User) => Promise<Date> = removeQueryOption.bind(this);
  addSelection: (serial: string, input: WebServiceSelection, issuer: User) => Promise<DataStore | null> = addSelection.bind(this);
  removeSelection: (serial: string, field: string, issuer: User) => Promise<DataStore | null> = removeSelection.bind(this);

  // Aggregation
  // --------------------------------------------------------------------------------------
  setAggregation: (serial: string, aggr: AggregationDataStoreConfig, issuer: User) => Promise<DataStore | null> = setAggregation.bind(this);

  // fields
  // --------------------------------------------------------------------------------------
  addField: (serial: string, field: Field, issuer: User) => Promise<Field[]> = addField.bind(this);
  updateField: (serial: string, field: string, input: UpdateFieldInput, issuer: User) => Promise<Date> = updateField.bind(this);
  updateFieldConfig: (serial: string, field: string, input: UpdateFieldConfigInput, issuer: User) => Promise<Date> = updateFieldConfig.bind(this);
  setFieldConstraint: (serial: string, field: string, constrinat: ValueConstraint | null, issuer: User) => Promise<Date> = setFieldConstraint.bind(this);
  removeField: (serial: string, field: string, issuer: User) => Promise<Date> = removeField.bind(this);


  // relations
  // --------------------------------------------------------------------------------------
  addRelation: (serial: string, input: AddRelationInput) => Promise<SubDataStore> = addRelation.bind(this);
  updateRelation: (serial: string, rSerial: string, input: UpdateRelationInput) => Promise<boolean> = updateRelation.bind(this);
  addRelationChart: (serial: string, rSerial: string, input: AddRelationChartInput) => Promise<string> = addRelationChart.bind(this);
  updateRelationChart: (serial: string, rSerial: string, cSerial: string, input: UpdateRelationChartInput) => Promise<boolean> = updateRelationChart.bind(this);
  reorderRelationCharts: (serial: string, rSerial: string, order: string[]) => Promise<boolean> = reorderRelationCharts.bind(this);
  removeRelationChart: (serial: string, rSerial: string, cSerial: string) => Promise<boolean> = removeRelationChart.bind(this);
  removeRelation: (serial: string, rSerial: string) => Promise<boolean> = removeRelation.bind(this);

  // collaborators
  // ---------------------------------------------------------------------------------
  addCollaborator: (serial: string, collaborator: string, issuer: User) => Promise<Date> = addCollaborator.bind(this);
  removeCollaborator: (serial: string, collaborator: string, issuer: User) => Promise<Date> = removeCollaborator.bind(this);

  // update activation
  // --------------------------------------------------------------------------------------
  setActivation: (serial: string, is_active: boolean, issuer: User) => Promise<Date> = setActivation.bind(this);
}