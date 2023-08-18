import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { avatarUpload } from "../../middlewares/upload";
import { validate } from "../../middlewares/validate";
import { AccountController } from "./controller";
import { AccountValidators } from "./validators";

export const accountRoutes = Router()
  .put(
    '/username',
    apiAuth(),
    validate(AccountValidators.UPDATE_USERNAME),
    AccountController.updateUsername
  )
  .put(
    '/password',
    apiAuth(),
    validate(AccountValidators.UPDATE_PASSWORD),
    AccountController.updatePassword
  )
  .put(
    '/profile',
    apiAuth(),
    validate(AccountValidators.UPDATE_PROFILE),
    AccountController.updateProfile
  )
  .put(
    '/avatar',
    apiAuth(),
    avatarUpload.single('avatar'),
    AccountController.updateAvatar
  )
  .delete(
    '/avatar',
    apiAuth(),
    AccountController.removeAvatar
  )