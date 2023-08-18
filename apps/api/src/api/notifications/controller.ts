import { notificationsModel } from "../../models";
import { NotificationsApi } from "./types";

export const controller = {
  async getAll(_: NotificationsApi.GetReq, res: NotificationsApi.GetRes) {
    res.json(await notificationsModel.getAll(res.locals.issuer.serial));
  },

  async get(req: NotificationsApi.GetByIdReq, res: NotificationsApi.GetByIdRes) {
    res.json(await notificationsModel.getBySerial(req.params.serial));
  },

  async setSeen(req: NotificationsApi.SetSeenReq, res: NotificationsApi.SetSeenRes) {
    res.json(await notificationsModel.setSeen(req.params.serial));
  },
}