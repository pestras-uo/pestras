import { Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { imagesUpload } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { controller } from "./controller";
import { ReportValidators } from "./validators";

export const reportsRoutes = Router()
  .get(
    '/topic/:topic',
    apiAuth(),
    controller.getByTopic
  )
  .get(
    '/:serial',
    apiAuth(),
    controller.getBySerial
  )
  // create
  // --------------------------------------------------------------------------
  .post(
    '/',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.CREATE),
    controller.create
  )
  // update
  // --------------------------------------------------------------------------
  .put(
    '/:serial',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.UPDATE),
    controller.update
  )
  // slides
  // --------------------------------------------------------------------------
  .post(
    '/:serial/slides',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.ADD_SLIDE),
    controller.addSlide
  )
  .put(
    '/:serial/slides',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.ORDER_SLIDES),
    controller.updateSlidesOrder
  )
  .put(
    '/:serial/slides/:slide',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.UPDATE_SLIDE),
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
    validate(ReportValidators.ADD_VIEW),
    controller.addView
  )
  .put(
    '/:serial/slides/:slide/views',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.ORDER_VIEWS),
    controller.updateViewsOrder
  )
  .put(
    '/:serial/views/:view',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.UPDATE_VIEW),
    controller.updateView
  )
  .put(
    '/:serial/views/:view/content',
    apiAuth([Role.REPORTER]),
    validate(ReportValidators.UPDATE_VIEW_CONTENT),
    controller.updateViewContent
  )
  .put(
    '/:serial/views/:view/image',
    apiAuth([Role.REPORTER]),
    imagesUpload.single('image'),
    controller.updateViewImageContent
  )
  .delete(
    '/:serial/views/:view',
    apiAuth([Role.REPORTER]),
    controller.removeView
  )
  // access
  // --------------------------------------------------------------------------
  .post(
    '/:serial/access/orgunits/:orgunit',
    apiAuth([Role.ADMIN]),
    controller.addOrgunit
  )
  .delete(
    '/:serial/access/orgunits/:orgunit',
    apiAuth([Role.ADMIN]),
    controller.removeOrgunit
  )
  .post(
    '/:serial/access/users/:user',
    apiAuth([Role.ADMIN]),
    controller.addUser
  )
  .delete(
    '/:serial/access/users/:user',
    apiAuth([Role.ADMIN]),
    controller.removeUser
  )
  .post(
    '/:serial/access/groups/:group',
    apiAuth([Role.ADMIN]),
    controller.addGroup
  )
  .delete(
    '/:serial/access/groups/:group',
    apiAuth([Role.ADMIN]),
    controller.removeGroup
  )
  // delete
  // --------------------------------------------------------------------------
  .delete(
    '/:serial',
    apiAuth([Role.ADMIN]),
    controller.delete
  );