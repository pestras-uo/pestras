import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { validate } from "../../middlewares/validate";
import { WorkspaceValidators } from "./validators";

export const workspacesRouter = Router()
  .get(
    '/',
    apiAuth(),
    controller.getByOwner
  )
  .post(
    '/groups',
    apiAuth(),
    validate(WorkspaceValidators.ADD_GROUP),
    controller.addGroup
  )
  .put(
    '/groups/:group',
    apiAuth(),
    validate(WorkspaceValidators.UPDATE_GROUP),
    controller.updateGroup
  )
  .delete(
    '/groups/:group',
    apiAuth(),
    controller.removeGroup
  )
  .post(
    '/pins',
    apiAuth(),
    validate(WorkspaceValidators.ADD_PIN),
    controller.addPin
  )
  .delete(
    '/pins/:pin',
    apiAuth(),
    controller.removePin
  )
  .post(
    '/slides',
    apiAuth(),
    validate(WorkspaceValidators.ADD_SLIDE),
    controller.addSlide
  )
  .delete(
    '/slides/:slide',
    apiAuth(),
    controller.removeSlide
  );