import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controllers";
import { validate } from "../../middlewares/validate";
import { TopicsValidators } from "./validators";
import { Role } from "@pestras/shared/data-model";

export const topicsRoutes = Router()
  .get(
    '/bp/:bp',
    apiAuth(),
    controller.getByBpReq
  )
  .get(
    '/parent/:parent?',
    apiAuth(),
    controller.getByParentReq
  )
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerialReq
  )
  .post(
    '/',
    apiAuth([Role.ADMIN]),
    validate(TopicsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth([Role.ADMIN]),
    validate(TopicsValidators.UPDATE),
    controller.update
  );