import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";
import { Role } from "@pestras/shared/data-model";
import { validate } from "../../middlewares/validate";
import { dashboardsValidators } from "./validators";

export const dashboardsRoutes = Router()
  .get(
    '/topic/:topic',
    apiAuth(),
    controller.getByTopic
  )
  .get(
    '/count',
    apiAuth(),
    controller.count
  )
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  .post(
    '/search',
    apiAuth(),
    controller.search
  )
  // create
  // --------------------------------------------------------------------------
  .post(
    '/',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.CREATE),
    controller.create
  )
  // update
  // --------------------------------------------------------------------------
  .put(
    '/:serial',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.UPDATE),
    controller.update
  )
  // slides
  // --------------------------------------------------------------------------
  .post(
    '/:serial/slides',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.ADD_SLIDE),
    controller.addSlide
  )
  .put(
    '/:serial/slides',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.ORDER_SLIDES),
    controller.updateSlidesOrder
  )
  .put(
    '/:serial/slides/:slide',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.UPDATE_SLIDE),
    controller.updateSlide
  )
  .delete(
    '/:serial/slides/:slide',
    apiAuth([Role.REPORTER]),
    controller.removeSlide
  )
  // views
  // --------------------------------------------------------------------------
  .post(
    '/:serial/views',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.ADD_VIEW),
    controller.addView
  )
  .put(
    '/:serial/slides/:slide/views',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.ORDER_VIEWS),
    controller.updateViewsOrder
  )
  .put(
    '/:serial/views/:view',
    apiAuth([Role.REPORTER]),
    validate(dashboardsValidators.UPDATE_VIEW),
    controller.updateView
  )
  .put(
    '/:serial/views/:view/data-viz/:dataViz',
    apiAuth([Role.REPORTER]),
    controller.updateViewDataViz
  )
  .delete(
    '/:serial/views/:view',
    apiAuth([Role.REPORTER]),
    controller.removeView
  )
  // delete
  // --------------------------------------------------------------------------
  .delete(
    '/:serial',
    apiAuth([Role.ADMIN]),
    controller.delete
  );