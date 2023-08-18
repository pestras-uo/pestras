import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { Role } from "@pestras/shared/data-model";
import { AnalysisValidator } from "./validators";
import { validate } from "../../middlewares/validate";

export const analysisRoutes = Router()
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  .post(
    '/',
    apiAuth([Role.DATA_ENG]),
    validate(AnalysisValidator.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    validate(AnalysisValidator.UPDATE),
    controller.update
  );