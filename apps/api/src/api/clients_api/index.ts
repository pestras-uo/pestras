import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";
import { validate } from "../../middlewares/validate";
import { ClientApiValidators } from "./validators";

export const clientsApiRoutes = Router()
  .get(
    '/blueprint/:blueprint',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.getByBlueprint
  )
  .get(
    '/:serial',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.getBySerial
  )
  .post(
    '/',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.UPDATE),
    controller.update
  )
  .post(
    '/:serial/ips',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.ADD_IP),
    controller.addIP
  )
  .put(
    '/:serial/ips',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.REMOVE_IP),
    controller.removeIP
  )
  .post(
    '/:serial/data-stores/:ds',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.ADD_DATA_STORE),
    controller.addDataStore
  )
  .put(
    '/:serial/data-stores/:ds',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.UPDATE_DATA_STORE),
    controller.updateDataStore
  )
  .delete(
    '/:serial/data-stores/:ds',
    apiAuth([Role.DATA_ENG]),
    controller.removeDataStore
  )
  .post(
    '/:serial/data-stores/:ds/params',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.ADD_PARAM),
    controller.addParam
  )
  .put(
    '/:serial/data-stores/:ds/params/:param',
    apiAuth([Role.DATA_ENG]),
    validate(ClientApiValidators.UPDATE_PARAM),
    controller.updateParam
  )
  .delete(
    '/:serial/data-stores/:ds/params/:param',
    apiAuth([Role.DATA_ENG]),
    controller.removeParam
  )
  .delete(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    controller.delete
  )