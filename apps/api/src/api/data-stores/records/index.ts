import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../../middlewares/auth";
import { tmpUpload } from "../../../middlewares/upload";
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
    apiAuth([Role.AUTHOR, Role.DATA_ENG]),
    tmpUpload.any(),
    validate(RecordsValidators.CREATE),
    controller.create
  )
  .put(
    '/:record',
    apiAuth([Role.AUTHOR, Role.DATA_ENG]),
    tmpUpload.any(),
    validate(RecordsValidators.UPDATE),
    controller.update
  )
  .put(
    '/history/:history/revert',
    apiAuth([Role.AUTHOR, Role.DATA_ENG]),
    controller.revertHistory
  )
  .delete(
    '/:record',
    apiAuth([Role.ADMIN, Role.DATA_ENG]),
    controller.delete
  )