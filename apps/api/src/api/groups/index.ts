import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";
import { validate } from "../../middlewares/validate";
import { UsersGroupsValidators } from "./validators";

export const usersGroupsRoutes = Router()
  .get(
    '/',
    apiAuth([Role.ADMIN]),
    controller.getAll
  )
  .get(
    '/:serial',
    apiAuth([Role.ADMIN]),
    controller.getBySerial
  )
  .post(
    '/',
    apiAuth([Role.ADMIN]),
    validate(UsersGroupsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.ADMIN]),
    validate(UsersGroupsValidators.UPDATE),
    controller.update
  )
  .delete(
    '/:serial',
    apiAuth([Role.ADMIN]),
    controller.delete
  );