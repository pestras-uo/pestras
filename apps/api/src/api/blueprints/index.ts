import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { validate } from "../../middlewares/validate";
import { BlueprintsValidators } from "./validators";
import { Role } from "@pestras/shared/data-model";
import { checkOwner } from "./middlewares";

export const blueprintsRoutes = Router()
  .get(
    '/',
    apiAuth(),
    controller.getAll
  )
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  .post(
    '/',
    apiAuth([Role.DATA_ENG]),
    validate(BlueprintsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    checkOwner(true),
    validate(BlueprintsValidators.UPDATE),
    controller.update
  )
  .put(
    '/:serial/owner/:owner',
    apiAuth([Role.ADMIN]),
    controller.setOwner
  )
  .post(
    '/:serial/collaborators/:collaborator',
    apiAuth([Role.DATA_ENG]),
    checkOwner(),
    controller.addCollaborator
  )
  .delete(
    '/:serial/collaborators/:collaborator',
    apiAuth([Role.DATA_ENG]),
    checkOwner(),
    controller.removeCollaborator
  )