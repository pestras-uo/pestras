import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";
import { WorkflowValidators } from "./validators";
import { validate } from "../../middlewares/validate";

export const workflowsRouter = Router()
  .get(
    '/:serial',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.getBySerial
  )
  .get(
    '/blueprint/:blueprint',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.getByBlueprint
  )
  .post(
    '/',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    validate(WorkflowValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial/name',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    validate(WorkflowValidators.UPDATE_NAME),
    controller.updateName
  )
  .put(
    '/:serial/steps',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    validate(WorkflowValidators.UPDATE_STEPS),
    controller.updateSteps
  )