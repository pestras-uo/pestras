import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { controller } from "./controller";

export const entityAccessRouter = Router()
  .get(
    '/:entity',
    apiAuth(),
    controller.getByEntity
  )
  .put(
    '/:entity/guests',
    apiAuth(),
    controller.allowGuests
  )
  .post(
    '/:entity/orgunits/:orgunit',
    apiAuth(),
    controller.addOrgunit
  )
  .delete(
    '/:entity/orgunits/:orgunit',
    apiAuth(),
    controller.removeOrgunit
  )
  .post(
    '/:entity/users/:user',
    apiAuth(),
    controller.addUser
  )
  .delete(
    '/:entity/users/:user',
    apiAuth(),
    controller.removeUser
  )
  .post(
    '/:entity/groups/:group',
    apiAuth(),
    controller.addGroup
  )
  .delete(
    '/:entity/groups/:group',
    apiAuth(),
    controller.removeGroup
  );