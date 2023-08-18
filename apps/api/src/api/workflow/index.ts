import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";

export const workflowRoutes = Router()
  .get(
    '/:ds/:record',
    apiAuth(),
    controller.getByRecord
  )
  .post(
    '/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.publish
  )
  .put(
    '/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.approve
  )
  .delete(
    '/:ds/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG, Role.AUTHOR]),
    controller.cancel
  )