/* eslint-disable @typescript-eslint/no-namespace */
import { DataStore, WebServiceConfig, WSQueryOptions, AggregationDataStoreConfig, Field, ValueConstraint, WebServiceSelection, DataStoreSettings } from '@pestras/shared/data-model';

export const basePath = `/data-stores`;

// Data Stores Api
// ========================================================================================
export namespace DataStoresApi {

  // read
  // --------------------------------------------------------------------------------------
  // GET
  export namespace GetBySerial {
    export const REQ_PATH = `${basePath}/:serial`;

    export interface Params { serial: string; }

    export type Response = DataStore | null;
  }


  // POST
  export namespace GetByBluePrint {
    export const REQ_PATH = basePath + '/blueprints/:bp';

    export interface Params { bp: string; }

    export type Response = DataStore[];
  }


  // create
  // --------------------------------------------------------------------------------------
  // POST
  export namespace Create {
    export const REQ_PATH = `${basePath}`;

    export type Body = Pick<DataStore, 'blueprint' | 'name' | 'type'>;

    export type Response = DataStore;
  }


  // update
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace Update {
    export const REQ_PATH = `${basePath}/:serial`;

    export interface Params { serial: string; }

    export type Body = Pick<DataStore, 'name'>;

    export type Response = string; // date
  }

  // PUT
  export namespace Build {
    export const REQ_PATH = `${basePath}/:serial/build`;

    export interface Params { serial: string; }

    export type Response = string; // date
  }


  // table
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace SetTableSettings {
    export const REQ_PATH = `${basePath}/:serial/table-settings`;

    export interface Params { serial: string; }

    export type Body = DataStoreSettings;

    export type Response = string; // date
  }


  // web service
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace SetWebServiceSettings {
    export const REQ_PATH = `${basePath}/:serial/web-service`;

    export interface Params { serial: string; }

    export type Body = Omit<
      WebServiceConfig,
      | 'auth'
      | 'headers'
      | 'initialized'
      | 'payload'
      | 'selection'
    >;

    export type Response = string; // date
  }

  // PUT
  export namespace SetWebServiceAuth {
    export const REQ_PATH = `${basePath}/:serial/web-service/auth`;

    export interface Params { serial: string; }

    export interface Body { username: string; password: string; }

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveWebServiceAuth {
    export const REQ_PATH = `${basePath}/:serial/web-service/auth`;

    export interface Params { serial: string; }

    export type Response = string; // date
  }

  // PUT
  export namespace SetWebServiceHeader {
    export const REQ_PATH = `${basePath}/:serial/web-service/headers`;

    export interface Params { serial: string; }

    export interface Body { key: string; value: string; }

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveWebServiceHeader {
    export const REQ_PATH = `${basePath}/:serial/web-service/headers/:key`;

    export interface Params { serial: string; key: string; }

    export type Response = string; // date
  }

  // POST
  export namespace AddWebServiceQuery {
    export const REQ_PATH = `${basePath}/:serial/web-service/query-options`;

    export interface Params { serial: string; }

    export type Body = Omit<WSQueryOptions, 'serial'>;

    export type Response = { option: WSQueryOptions, date: string };
  }

  // DELETE
  export namespace RemoveWebServiceParam {
    export const REQ_PATH = `${basePath}/:serial/web-service/query-options/:option`;

    export interface Params { serial: string; option: string; }

    export type Response = string; // date
  }

  // POST
  export namespace AddWebServiceSelection {
    export const REQ_PATH = `${basePath}/:serial/web-service/selection`;

    export interface Params { serial: string; }

    export type Body = WebServiceSelection;

    export type Response = DataStore;
  }

  // DELETE
  export namespace RemoveWebServiceSelection {
    export const REQ_PATH = `${basePath}/:serial/web-service/selection/:field`;

    export interface Params { serial: string; field: string; }

    export type Response = DataStore;
  }


  // aggregation
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace SetAggregationSettings {
    export const REQ_PATH = `${basePath}/:serial/aggregation`;

    export interface Params { serial: string; }

    export type Body = AggregationDataStoreConfig;

    export type Response = DataStore; // date
  }


  // fields
  // --------------------------------------------------------------------------------------
  // POST
  export namespace AddField {
    export const REQ_PATH = `${basePath}/:serial/fields`;

    export interface Params { serial: string; }

    export type Body = Omit<Field, 'constraint' | 'system' | 'automated'>;

    export type Response = string; // date
  }

  // PUT
  export namespace UpdateField {
    export const REQ_PATH = `${basePath}/:serial/fields/:field`;

    export interface Params { serial: string; field: string; }

    export type Body = Pick<Field, 'display_name' | 'group' | 'desc'>;

    export type Response = string; // date
  }

  // PUT
  export namespace UpdateFieldConfig {
    export const REQ_PATH = `${basePath}/:serial/fields/:field/config`;

    export interface Params { serial: string; field: string; }

    export type Body = Omit<Field, 'constraint' | 'system' | 'automated'>;

    export type Response = string; // date
  }

  // PUT
  export namespace SetFieldConstraint {
    export const REQ_PATH = `${basePath}/:serial/fields/:field/constraint`;

    export interface Params { serial: string; field: string; }

    export type Body = ValueConstraint;

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveFieldConstraint {
    export const REQ_PATH = `${basePath}/:serial/fields/:field/constraint`;

    export interface Params { serial: string; field: string; }

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveField {
    export const REQ_PATH = `${basePath}/:serial/fields/:field`;

    export interface Params { serial: string; field: string; }

    export type Response = string; // date
  }


  // owner & collaborators
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace SetOwner {
    export const REQ_PATH = `${basePath}/:serial/owner/:owner`;

    export interface Params { serial: string; owner: string; }

    export type Response = string; // date
  }

  // POST
  export namespace AddCollaborator {
    export const REQ_PATH = `${basePath}/:serial/collaborators/:collaborator`;

    export interface Params { serial: string; collaborator: string; }

    export type Response = string; // date
  }

  // DELETE
  export namespace RemoveCollaborator {
    export const REQ_PATH = `${basePath}/:serial/collaborators/:collaborator`;

    export interface Params { serial: string; collaborator: string; }

    export type Response = string; // date
  }


  // activation
  // --------------------------------------------------------------------------------------
  // PUT
  export namespace SetActiviation {
    export const REQ_PATH = `${basePath}/:serial/activaition/:is_active?`;

    export interface Params { serial: string; is_active?: string; }

    export type Response = string; // date
  }
}
