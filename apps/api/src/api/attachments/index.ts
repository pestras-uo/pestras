import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { Role } from "@pestras/shared/data-model";
import { validate } from "../../middlewares/validate";
import { attachmentsValidators } from "./validators";
import { attachmentsUpload } from "../../middlewares/upload";

export const attachmentsRoutes = Router()
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  .get(
    '/entity/:entity',
    apiAuth(),
    controller.getByEntity
  )
  .post(
    '/',
    apiAuth([Role.AUTHOR, Role.REPORTER]),
    attachmentsUpload.single("attachment"),
    validate(attachmentsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial/name',
    apiAuth([Role.AUTHOR, Role.REPORTER]),
    validate(attachmentsValidators.UPDATE_NAME),
    controller.updateName
  )
  .delete(
    '/:serial',
    apiAuth([Role.AUTHOR, Role.REPORTER]),
    controller.remove
  )
  .delete(
    '/entity/:entity',
    apiAuth([Role.AUTHOR, Role.REPORTER]),
    controller.removeByEntity
  )