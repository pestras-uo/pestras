import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";

export const notificationsRoutes = Router()
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
  .put(
    '/:serial/seen',
    apiAuth(),
    controller.setSeen
  )