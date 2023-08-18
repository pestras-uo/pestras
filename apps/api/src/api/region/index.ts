import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { controller } from "./controller";
import { RegionsValidators } from "./validators";

export const regionsRoutes = Router()
  .get(
    '/',
    apiAuth(),
    controller.getAll
  )
  .get(
    '/:serial',
    apiAuth(),
    controller.get
  )
  .post(
    '/',
    apiAuth([Role.ADMIN]),
    validate(RegionsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.ADMIN]),
    validate(RegionsValidators.UPDATE),
    controller.update
  )
  .put(
    '/:serial/coords',
    apiAuth([Role.ADMIN]),
    validate(RegionsValidators.UPDATE_COORDS),
    controller.updateCoords
  );