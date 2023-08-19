import { HttpError, HttpCode } from "@pestras/backend/util";
import { usersModel, authModel } from "../../models";
import fs from 'fs';
import path from 'path';
import config from "../../config";
import argon from 'argon2';
import { AccountApi } from './types';
import { NextFunction } from "express";

export const AccountController = {

  async updateUsername(req: AccountApi.UpdateUsernameReq, res: AccountApi.UpdateUsernameRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateUsername(res.locals.issuer.serial, req.body.username));
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req: AccountApi.UpdatePasswordReq, res: AccountApi.UpdatePasswordRes, next: NextFunction) {
    try {
      const auth = await authModel.getByUserSerial(res.locals.issuer.serial, { password: 1 });
  
      if (!auth)
        throw new HttpError(HttpCode.NOT_FOUND, "userNotFound");
  
      if (!(await argon.verify(auth.password, req.body.currentPassword)))
        throw new HttpError(HttpCode.FORBIDDEN, "wrongPassword");
  
      const hashedPass = await argon.hash(req.body.newPassword);
  
      res.json(await authModel.updatePassword(res.locals.issuer.serial, hashedPass));
      
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AccountApi.UpdateProfileReq, res: AccountApi.UpdateProfileRes, next: NextFunction) {
    try {
      res.json(await usersModel.updateProfile(
        res.locals.issuer.serial,
        req.body.fullname,
        req.body.mobile,
        req.body.email
      ));
      
    } catch (error) {
      next(error);
    }
  },

  async updateAvatar(req: AccountApi.UpdateAvatarReq, res: AccountApi.UpdateAvatarRes, next: NextFunction) {
    try {
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
      
    } catch (error) {
      next(error);
    }
  },

  async removeAvatar(_: AccountApi.RemoveAvatarReq, res: AccountApi.RemoveAvatarRes, next: NextFunction) {
    try {
      const avatarPath = res.locals.issuer.avatar;
  
      if (!avatarPath)
        res.json(res.locals.issuer.last_modified);
  
      const filename = avatarPath.slice(avatarPath.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'avatars', filename));
  
      await usersModel.updateAvatar(res.locals.issuer.serial, null);
  
      res.json(await usersModel.updateAvatar(res.locals.issuer.serial, null));
      
    } catch (error) {
      next(error);
    }
  }
}
