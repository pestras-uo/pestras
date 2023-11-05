/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from "express";
import { UserSession } from "../../auth";
import { CreateDataStoreInput, SetWebServiceConfigInput, UpdateFieldConfigInput, UpdateFieldInput } from "@pestras/backend/models";
import {
  DataStore,
  ApiQuery,
  DataStoreState,
  WSAuth,
  WSQueryOptions,
  AggregationDataStoreConfig,
  ValueConstraint,
  WebServiceSelection,
  Field,
  DataStoreSettings
} from "@pestras/shared/data-model";

export namespace DataStoreApi {
  // read
  // ---------------------------------------------------------------------------------------
  export const GET_BY_SERIAL_REQ_PATH = "/:serial";
  export type GetBySerialReq = Request<{ serial: string; }>;
  export type GetBySerialRes = Response<DataStore | null, UserSession>;

  export const GET_BY_BLUEPRINT_REQ_PATH = "/blueprints/:bp";
  export type GetByBlueprintReq = Request<{ bp: string; }, any, ApiQuery<DataStore>>;
  export type GetByBlueprintRes = Response<DataStore[], UserSession>;

  // create
  // ---------------------------------------------------------------------------------------
  export const CREATE_REQ_PATH = '/';
  export type CreateReq = Request<any, any, CreateDataStoreInput>;
  export type CreateRes = Response<DataStore, UserSession>;

  // update
  // --------------------------------------------------------------------------------------
  export const UPDATE_REQ_PATH = '/:serial';
  export type UpdateReq = Request<{ serial: string; }, any, { name: string; }>;
  export type UpdateRes = Response<Date, UserSession>;

  export const UPDATE_STATE_REQ_PATH = '/:serial/state';
  export type UpdateStateReq = Request<{ serial: string; }, any, { state: Exclude<DataStoreState, DataStoreState.BUILD> }>;
  export type UpdateStateRes = Response<Date, UserSession>;

  export const BUILD_REQ_PATH = '/:serial/build';
  export type BuildReq = Request<{ serial: string; }>;
  export type BuildRes = Response<boolean, UserSession>;

  // table
  // --------------------------------------------------------------------------------------
  export const SET_TABLE_SETTINGS_REQ_PATH = "/:serial/table-settings";
  export type SetTableSettingsReq = Request<{ serial: string; }, any, DataStoreSettings>;
  export type SetTableSettingsRes = Response<Date, UserSession>;

  // web service
  // --------------------------------------------------------------------------------------
  export const SET_WEB_SERVICE_REQ_PATH = "/:serial/web-service";
  export type SetWebServiceReq = Request<{ serial: string; }, any, SetWebServiceConfigInput>;
  export type SetWebServiceRes = Response<Date, UserSession>;

  export const SET_WEB_SERVICE_AUTH_REQ_PATH = "/:serial/web-service/auth";
  export type SetWebServiceAuthReq = Request<{ serial: string; }, any, WSAuth>;
  export type SetWebServiceAuthRes = Response<Date, UserSession>;

  export const REMOVE_WEB_SERVICE_AUTH_REQ_PATH = "/:serial/web-service/auth";
  export type RemoveWebServiceAuthReq = Request<{ serial: string; }>;
  export type RemoveWebServiceAuthRes = Response<Date, UserSession>;

  export const SET_WEB_SERVICE_HEADER_REQ_PATH = "/:serial/web-service/headers"
  export type SetWebServiceHeaderReq = Request<{ serial: string; }, any, { key: string; value: string; }>;
  export type SetWebServiceHeaderRes = Response<Date, UserSession>;

  export const REMOVE_WEB_SERVICE_HEADER_REQ_PATH = "/:serial/web-service/headers/:key"
  export type RemoveWebServiceHeaderReq = Request<{ serial: string; key: string }>;
  export type RemoveWebServiceHeaderRes = Response<Date, UserSession>;

  export const ADD_WEB_SERVICE_QUERY_REQ_PATH = "/:serial/web-service/query-options";
  export type AddWebServiceQueryReq = Request<{ serial: string; }, any, WSQueryOptions>;
  export type AddWebServiceQueryRes = Response<{ option: WSQueryOptions; date: Date; }, UserSession>;

  export const REMOVE_WEB_SERVICE_QUERY_REQ_PATH = "/:serial/web-service/query-options/:option";
  export type RemoveWebServiceQueryReq = Request<{ serial: string; option: string; }>;
  export type RemoveWebServiceQueryRes = Response<Date, UserSession>;

  export const ADD_WEB_SERVICE_SELECTION_REQ_PATH = "/:serial/web-service/selection";
  export type AddWebServiceSelectionReq = Request<{ serial: string; }, any, WebServiceSelection>;
  export type AddWebServiceSelectionRes = Response<DataStore, UserSession>;

  export const REMOVE_WEB_SERVICE_SELECTION_REQ_PATH = "/:serial/web-service/selection/:field";
  export type RemoveWebServiceSelectionReq = Request<{ serial: string; field: string; }>;
  export type RemoveWebServiceSelectionRes = Response<DataStore, UserSession>;

  // aggregation
  // --------------------------------------------------------------------------------------
  export const SET_AGGR_REQ_PATH = "/:serial/aggregation";
  export type SetAggregationReq = Request<{ serial: string; }, any, AggregationDataStoreConfig>;
  export type SetAggregationRes = Response<DataStore, UserSession>;

  // fields
  // --------------------------------------------------------------------------------------
  export const ADD_FIELD_REQ_PATH = "/:serial/fields";
  export type AddFieldReq = Request<{ serial: string; }, any, Field>;
  export type AddFieldRes = Response<Field[], UserSession>;

  export const UPDATE_FIELD_REQ_PATH = "/:serial/fields/:field";
  export type UpdateFieldReq = Request<{ serial: string; field: string; }, any, UpdateFieldInput>;
  export type UpdateFieldRes = Response<Date, UserSession>;

  export const UPDATE_FIELD_CONFIG_REQ_PATH = "/:serial/fields/:field/config";
  export type UpdateFieldConfigReq = Request<{ serial: string; field: string; }, any, UpdateFieldConfigInput>;
  export type UpdateFieldConfigRes = Response<Date, UserSession>;

  export const SET_FIELD_CONSTRAINT_REQ_PATH = "/:serial/fields/:field/constraint";
  export type SetFieldConstraintReq = Request<{ serial: string; field: string; }, any, ValueConstraint>;
  export type SetFieldConstraintRes = Response<Date, UserSession>;

  export const REMOVE_FIELD_CONSTRAINT_REQ_PATH = "/:serial/fields/:field/constraint";
  export type RemopveFieldConstraintReq = Request<{ serial: string; field: string; }>;
  export type RemopveFieldConstraintRes = Response<Date, UserSession>;

  export const REMOVE_FIELD_REQ_PATH = "/:serial/fields/:field";
  export type RemopveFieldReq = Request<{ serial: string; field: string; }>;
  export type RemopveFieldRes = Response<Date, UserSession>;

  // update collaborators
  // --------------------------------------------------------------------------------------
  export const ADD_COLLABORATOR_REQ_PATH = "/:serial/collaborators/:collaborator";
  export type AddCollaboratorReq = Request<{ serial: string; collaborator: string; }>;
  export type AddCollaboratorRes = Response<Date, UserSession>;

  export const REMOVE_COLLABORATOR_REQ_PATH = "/:serial/collaborators/:collaborator";
  export type RemoveCollaboratorReq = Request<{ serial: string; collaborator: string; }>;
  export type RemoveCollaboratorRes = Response<Date, UserSession>;

  // update activation
  // --------------------------------------------------------------------------------------
  export const SET_ACTIVATION_REQ_PATH = "/:serial/activaition/:is_active?";
  export type SetActivationReq = Request<{ serial: string; is_active?: string; }>;
  export type SetActivationRes = Response<Date, UserSession>;


  // records
  // --------------------------------------------------------------------------------------
  export const RECORDS_ROOT_PATH = "/:serial/records";
}