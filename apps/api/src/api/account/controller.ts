import { HttpError, HttpCode } from "@pestras/backend/util";
import { usersModel, authModel } from "../../models";
import fs from 'fs';
import path from 'path';
import config from "../../config";
import argon from 'argon2';
import { AccountApi } from './types';

export const AccountController = {

  async updateUsername(req: AccountApi.UpdateUsernameReq, res: AccountApi.UpdateUsernameRes) {
    res.json(await usersModel.updateUsername(res.locals.issuer.serial, req.body.username));
  },

  async updatePassword(req: AccountApi.UpdatePasswordReq, res: AccountApi.UpdatePasswordRes) {
    const auth = await authModel.getByUserSerial(res.locals.issuer.serial, { password: 1 });

    if (!auth)
      throw new HttpError(HttpCode.NOT_FOUND, "userNotFound");

    if (!(await argon.verify(auth.password, req.body.currentPassword)))
      throw new HttpError(HttpCode.FORBIDDEN, "wrongPassword");

    const hashedPass = await argon.hash(req.body.newPassword);

    res.json(await authModel.updatePassword(res.locals.issuer.serial, hashedPass));
  },

  async updateProfile(req: AccountApi.UpdateProfileReq, res: AccountApi.UpdateProfileRes) {
    res.json(await usersModel.updateProfile(
      res.locals.issuer.serial,
      req.body.fullname,
      req.body.mobile,
      req.body.email
    ));
  },

  async updateAvatar(req: AccountApi.UpdateAvatarReq, res: AccountApi.UpdateAvatarRes) {
    const avatarPath = req.file
      ? '/uploads/avatars/' + req.file?.filename
      : null;

    if (!avatarPath)
      throw new HttpError(HttpCode.UNKNOWN_ERROR, 'errorUploadingAvatar');

    const date = await usersModel.updateAvatar(res.locals.issuer.serial, avatarPath);

    res.json({ path: avatarPath, date });

    const currAvatar = res.locals.issuer.avatar;

    if (currAvatar) {
      const filename = currAvatar.slice(currAvatar.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'avatars', filename));
    }
  },

  async removeAvatar(_: AccountApi.RemoveAvatarReq, res: AccountApi.RemoveAvatarRes) {
    const avatarPath = res.locals.issuer.avatar;

    if (!avatarPath)
      res.json(res.locals.issuer.last_modified);

    const filename = avatarPath.slice(avatarPath.lastIndexOf('/') + 1);
    fs.unlinkSync(path.join(config.uploadsDir, 'avatars', filename));

    await usersModel.updateAvatar(res.locals.issuer.serial, null);

    res.json(await usersModel.updateAvatar(res.locals.issuer.serial, null));
  }
}
