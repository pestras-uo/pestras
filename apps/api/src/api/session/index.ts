import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { SessionController } from "./controller";
import { SessionValidators } from "./validators";

export const sessionRoutes = Router()
  .get(
    '/verify-session',
    apiAuth(),
    SessionController.verifySession
  )
  .post(
    '/login',
    validate(SessionValidators.LOGIN),
    SessionController.login
  )
  .delete(
    '/logout',
    apiAuth(),
    SessionController.logout
  );