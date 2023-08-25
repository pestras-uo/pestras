import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { Role } from "@pestras/shared/data-model";
import { controller } from "./controller";

export const activitiesRouter = Router()
  .get(
    '/week/:serial',
    apiAuth([Role.ADMIN]),
    controller.getLastWeekActs
  )
  .get(
    '/month/:serial',
    apiAuth([Role.ADMIN]),
    controller.getLastMonthActs
  )
  .get(
    '/year/:serial',
    apiAuth([Role.ADMIN]),
    controller.getLastYearActs
  )