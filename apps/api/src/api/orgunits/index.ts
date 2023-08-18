import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { logoUpload } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { OrgunitsController } from "./controller";
import { OrgunitsValidators } from "./validators";

export const orgunitRoutes = Router()
  .get(
    '/',
    apiAuth(),
    OrgunitsController.getAll
  )
  .get(
    '/:serial',
    apiAuth([Role.ADMIN]),
    OrgunitsController.get
  )
  .post(
    '/',
    apiAuth([Role.ADMIN]),
    validate(OrgunitsValidators.CREATE),
    OrgunitsController.create
  )
  .put(
    '/:serial',
    apiAuth([Role.ADMIN]),
    validate(OrgunitsValidators.UPDATE),
    OrgunitsController.update
  )
  .post(
    '/:serial/logo',
    apiAuth([Role.ADMIN]),
    logoUpload.single('logo'),
    OrgunitsController.updateLogo
  )
  .delete(
    '/:serial/logo',
    apiAuth([Role.ADMIN]),
    OrgunitsController.removeLogo
  )