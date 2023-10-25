import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { CategorriesController } from "./controller";
import { CategoriesValidators } from "./validators";

export const categoriesRoutes = Router()
  .get(
    '/parent/:serial',
    apiAuth(),
    CategorriesController.getByParent
  )
  .get(
    '/parent/:parent/value/:value',
    apiAuth(),
    CategorriesController.getByValue
  )
  .get(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    CategorriesController.getBySerial
  )
  .get(
    '/blueprint/:bp',
    apiAuth([Role.DATA_ENG]),
    CategorriesController.getByBlueprint
  )
  .post(
    '/',
    apiAuth([Role.DATA_ENG]),
    validate(CategoriesValidators.CREATE),
    CategorriesController.create
  )
  .put(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    validate(CategoriesValidators.UPDATE),
    CategorriesController.update
  )
  .delete(
    '/:serial',
    apiAuth([Role.DATA_ENG]),
    CategorriesController.delete
  )