import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../../middlewares/auth";
import { imagesUpload } from "../../../middlewares/upload";
import { validate } from "../../../middlewares/validate";
import { controller } from "./controller";
import { RecordsValidators } from "./validators";

export const recordsRoutes = Router({ mergeParams: true })
  .get(
    '/:record',
    apiAuth(),
    controller.getBySerial
  )
  .get(
    '/:record/histroy',
    apiAuth(),
    controller.getHistory
  )
  .post(
    '/search',
    apiAuth(),
    controller.search
  )
  .post(
    '/',
    apiAuth([Role.AUTHOR, Role.AUTHOR]),
    imagesUpload.any(),
    validate(RecordsValidators.CREATE),
    controller.create
  )
  .put(
    '/:record',
    apiAuth([Role.AUTHOR, Role.AUTHOR]),
    imagesUpload.any(),
    validate(RecordsValidators.UPDATE),
    controller.update
  )
  .delete(
    '/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.delete
  )