import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { imagesUpload } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { ContentValidators } from "./validators";

export const contentViewsRoutes = Router()
  .get(
    '/:entity',
    apiAuth(),
    controller.getByEntity
  )
  .post(
    '/:entity/views',
    apiAuth(),
    imagesUpload.single('image'),
    validate(ContentValidators.ADD_VIEW),
    controller.addView
  )
  .put(
    '/:entity/views',
    apiAuth(),
    validate(ContentValidators.UPDATE_VIEWS_ORDER),
    controller.updateViewsOrder
  )
  .put(
    '/:entity/views/:view',
    apiAuth(),
    validate(ContentValidators.UPDATE_VIEW),
    controller.updateView
  )
  .put(
    '/:entity/views/:view/content',
    apiAuth(),
    imagesUpload.single('image'),
    validate(ContentValidators.UPDATE_VIEW_CONTENT),
    controller.updateViewContent
  )
  .delete(
    '/:entity/views/:view',
    apiAuth(),
    controller.removeView
  )