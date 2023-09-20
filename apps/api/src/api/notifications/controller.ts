import { notificationsModel } from "@pestras/backend/models";
import { NotificationsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {
  async getAll(_: NotificationsApi.GetReq, res: NotificationsApi.GetRes, next: NextFunction) {
    try {
      res.json(await notificationsModel.getAll(res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async get(req: NotificationsApi.GetByIdReq, res: NotificationsApi.GetByIdRes, next: NextFunction) {
    try {
      res.json(await notificationsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async setSeen(req: NotificationsApi.SetSeenReq, res: NotificationsApi.SetSeenRes, next: NextFunction) {
    try {
      res.json(await notificationsModel.setSeen(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },
}