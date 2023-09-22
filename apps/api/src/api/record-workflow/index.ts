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
    controller.getRecordWfState
  )
  .post(
    '/:ds/:record/:trigger',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.publish
  )
  .put(
    '/approve/:ds/:step',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.approve
  )
  .put(
    '/reject/:ds/:step',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.cancel
  )
  .delete(
    '/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.cancel
  )