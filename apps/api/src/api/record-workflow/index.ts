import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";

export const recordWorkflowRoutes = Router()
  .get(
    '/:ds/:record',
    apiAuth(),
    controller.getByRecord
  )
  .get(
    '/state/:ds/:record',
    apiAuth(),
    controller.getByRecord
  )
  .post(
    '/:ds/:record/:trigger',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.publish
  )
  .put(
    '/pprove/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.approve
  )
  .put(
    '/reject/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.cancel
  )
  .delete(
    '/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.cancel
  )