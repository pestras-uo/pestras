import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { controller } from "./controllers";
import { CommentsValidators } from "./validators";

export const commentsRoutes = Router({ mergeParams: true })
  .get(
    '/:recordSerial',
    apiAuth(),
    controller.getComments
  )
  .post(
    '/:recordSerial',
    apiAuth(),
    validate(CommentsValidators.CREATE),
    controller.create
  )
  .put(
    '/:serial',
    apiAuth(),
    validate(CommentsValidators.UPDATE),
    controller.update
  )
  .delete(
    '/:serial',
    apiAuth(),
    controller.delete
  );