import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { Role } from "@pestras/shared/data-model";
import { DataVizValidator } from "./validators";
import { validate } from "../../middlewares/validate";

export const dataVizRoutes = Router()
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  .post(
    '/',
    apiAuth([Role.DATA_ENG]),
    validate(DataVizValidator.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    validate(DataVizValidator.UPDATE),
    controller.update
  );