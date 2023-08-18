import { usersGroupsModel } from "../../models";
import { UsersGroupsApi } from "./types";

export const controller = {

  async getAll(_: UsersGroupsApi.GetAllReq, res: UsersGroupsApi.GetAllRes) {
    res.json(await usersGroupsModel.getAll());
  },

  async getBySerial(req: UsersGroupsApi.GetBySerialReq, res: UsersGroupsApi.GetBySerialRes) {
    res.json(await usersGroupsModel.getBySerial(req.params.serial));
  },

  async create(req: UsersGroupsApi.CreateReq, res: UsersGroupsApi.CreateRes) {
    res.json(await usersGroupsModel.create(req.body.name, res.locals.issuer.serial));
  },

  async update(req: UsersGroupsApi.UpdateReq, res: UsersGroupsApi.UpdateRes) {
    res.json(await usersGroupsModel.update(req.params.serial, req.body.name, res.locals.issuer.serial));
  },

  async delete(req: UsersGroupsApi.DeleteReq, res: UsersGroupsApi.DeleteRes) {
    res.json(await usersGroupsModel.delete(req.params.serial, res.locals.issuer.serial));
  }

}