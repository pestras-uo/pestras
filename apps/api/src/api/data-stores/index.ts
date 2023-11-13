import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { controller } from "./controller";
import { recordsRoutes } from "./records";
import { DataStoreValidators } from "./validators";
import { DataStoreApi } from "./types";

export const dataStoresRoutes = Router()

  // read
  // ---------------------------------------------------------------------------------------
  .get(
    DataStoreApi.GET_BY_SERIAL_REQ_PATH,
    apiAuth(),
    controller.getBySerial
  )
  .get(
    DataStoreApi.GET_BY_BLUEPRINT_REQ_PATH,
    apiAuth(),
    controller.getByBlueprint
  )
  // create
  // ---------------------------------------------------------------------------------------
  .post(
    DataStoreApi.CREATE_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.CREATE),
    controller.create
  )
  // update
  // --------------------------------------------------------------------------------------
  .put(
    DataStoreApi.UPDATE_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE),
    controller.update
  )
  .put(
    DataStoreApi.UPDATE_STATE_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE_STATE),
    controller.updateState
  )
  .put(
    DataStoreApi.BUILD_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.build
  )
  // table
  // --------------------------------------------------------------------------------------
  .put(
    DataStoreApi.SET_TABLE_SETTINGS_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.SET_TABLE_SETTINGS),
    controller.setTableSettings
  )
  // web service
  // --------------------------------------------------------------------------------------
  .put(
    DataStoreApi.SET_WEB_SERVICE_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.WEB_SERVICE),
    controller.setWebService
  )
  .put(
    DataStoreApi.SET_WEB_SERVICE_AUTH_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.WEB_SERVICE_AUTH),
    controller.setWebServiceAuth
  )
  .delete(
    DataStoreApi.REMOVE_WEB_SERVICE_AUTH_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeWebServiceAuth
  )
  .put(
    DataStoreApi.SET_WEB_SERVICE_HEADER_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.WEB_SERVICE_HEADER),
    controller.setWebServiceHeader
  )
  .delete(
    DataStoreApi.REMOVE_WEB_SERVICE_HEADER_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeWebServiceHeader
  )
  .post(
    DataStoreApi.ADD_WEB_SERVICE_QUERY_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.WEB_SERVICE_OPTION),
    controller.addWebServiceQuery
  )
  .delete(
    DataStoreApi.REMOVE_WEB_SERVICE_QUERY_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeWebServiceQuery
  )
  .post(
    DataStoreApi.ADD_WEB_SERVICE_SELECTION_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.ADD_WS_SELECTION),
    controller.addWebServiceSelection
  )
  .delete(
    DataStoreApi.REMOVE_WEB_SERVICE_SELECTION_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeWebServiceSelection
  )
  // aggregation
  // --------------------------------------------------------------------------------------
  .put(
    DataStoreApi.SET_AGGR_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.AGGREGATION),
    controller.setAggregation
  )
  // fields
  // --------------------------------------------------------------------------------------
  .post(
    DataStoreApi.ADD_FIELD_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.ADD_FIELD),
    controller.addField
  )
  .put(
    DataStoreApi.UPDATE_FIELD_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE_FIELD),
    controller.updateField
  )
  .put(
    DataStoreApi.UPDATE_FIELD_CONFIG_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE_FIELD_CONFIG),
    controller.updateFieldConfig
  )
  .put(
    DataStoreApi.SET_FIELD_CONSTRAINT_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.FIELD_CONSTRAINT),
    controller.setFieldConstraint
  )
  .delete(
    DataStoreApi.REMOVE_FIELD_CONSTRAINT_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeFieldConstraint
  )
  .delete(
    DataStoreApi.REMOVE_FIELD_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeField
  )
  .post(
    DataStoreApi.ADD_RELATION_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.ADD_RELATION),
    controller.addRelation
  )
  .put(
    DataStoreApi.UPDATE_RELATION_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE_RELATION),
    controller.updateRelation
  )
  .post(
    DataStoreApi.ADD_RELATION_CHART_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.ADD_RELATION_CHART),
    controller.addRelationChart
  )
  .put(
    DataStoreApi.UPDATE_RELATION_CHART_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.UPDATE_RELATION_CHART),
    controller.updateRelationChart
  )
  .put(
    DataStoreApi.REORDER_RELATION_CHARTS_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    validate(DataStoreValidators.REORDER_RELATION_CHARTS),
    controller.reorderRelationCharts
  )
  .delete(
    DataStoreApi.REMOVE_RELATION_CHART_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeRelationChart
  )
  .delete(
    DataStoreApi.REMOVE_RELATION_REQ_PATH,
    apiAuth([Role.DATA_ENG]),
    controller.removeRelation
  )
  // update collaborators
  // --------------------------------------------------------------------------------------
  .post(
    DataStoreApi.ADD_COLLABORATOR_REQ_PATH,
    apiAuth([Role.ADMIN]),
    controller.addCollaborator
  )
  .delete(
    DataStoreApi.REMOVE_COLLABORATOR_REQ_PATH,
    apiAuth([Role.ADMIN]),
    controller.removeCollaborator
  )
  // update activation
  // --------------------------------------------------------------------------------------
  .put(
    DataStoreApi.SET_ACTIVATION_REQ_PATH,
    apiAuth([Role.ADMIN]),
    controller.setActivation
  )
  // sub routes
  // --------------------------------------------------------------------------------------
  .use(DataStoreApi.RECORDS_ROOT_PATH, recordsRoutes);