import { OrgunitsApi, Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { logoUpload } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { OrgunitsController } from "./controller";
import { OrgunitsValidators } from "./validators";

export const orgunitRoutes = Router()
  [OrgunitsApi.GetAll.REQ_METHOD](
    OrgunitsApi.GetAll.REQ_PATH,
    apiAuth(),
    OrgunitsController.getAll
  )
  [OrgunitsApi.GetBySerial.REQ_METHOD](
    OrgunitsApi.GetBySerial.REQ_PATH,
    apiAuth([Role.ADMIN]),
    OrgunitsController.getBySerial
  )
  [OrgunitsApi.Create.REQ_METHOD](
    OrgunitsApi.Create.REQ_PATH,
    apiAuth([Role.ADMIN]),
    validate(OrgunitsValidators.CREATE),
    OrgunitsController.create
  )
  [OrgunitsApi.Update.REQ_METHOD](
    OrgunitsApi.Update.REQ_PATH,
    apiAuth([Role.ADMIN]),
    validate(OrgunitsValidators.UPDATE),
    OrgunitsController.update
  )
  [OrgunitsApi.UpdateLogo.REQ_METHOD](
    OrgunitsApi.UpdateLogo.REQ_PATH,
    apiAuth([Role.ADMIN]),
    logoUpload.single('logo'),
    OrgunitsController.updateLogo
  )
  [OrgunitsApi.RemoveLogo.REQ_METHOD](
    OrgunitsApi.RemoveLogo.REQ_PATH,
    apiAuth([Role.ADMIN]),
    OrgunitsController.removeLogo
  )
  [OrgunitsApi.UpdateRegions.REQ_METHOD](
    OrgunitsApi.UpdateRegions.REQ_PATH,
    apiAuth([Role.ADMIN]),
    validate(OrgunitsValidators.UPDATE_REGIONS),
    OrgunitsController.updateRegions
  )