import { authModel, usersModel, workspaceModel } from "../../models";
import argon from 'argon2';
import { UsersApi } from "./types";

export const UsersController = {

  async getAll(_: UsersApi.GetAllReq, res: UsersApi.GetAllRes) {
    res.json(await usersModel.getAll());
  },

  async getBySerial(req: UsersApi.GetBySerialReq, res: UsersApi.GetBySerialRes) {
    res.json(await usersModel.getBySerial(req.params.serial));
  },

  async create(req: UsersApi.CreateReq, res: UsersApi.CreateRes) {
    const hashed = await argon.hash(req.body.password);
    const user = await usersModel.create(req.body, hashed, res.locals.issuer.serial);

    await authModel.create({ user: user.serial, password: hashed });
    await workspaceModel.create(user.serial);

    res.json(user);
  },

  // roles
  // --------------------------------------------------------------------------------------------------
  async updateRoles(req: UsersApi.UpdateRoleReq, res: UsersApi.UpdateRoleRes) {
    res.json(await usersModel.updateRoles(req.params.serial, req.body, res.locals.issuer.serial));
  },

  // groups
  // --------------------------------------------------------------------------------------------------
  async addGroup(req: UsersApi.AddGroupReq, res: UsersApi.AddGroupRes) {
    res.json(await usersModel.addGroup(req.params.serial, req.params.group, res.locals.issuer.serial));
  },

  async removeGroup(req: UsersApi.RemoveGroupReq, res: UsersApi.RemoveGroupRes) {
    res.json(await usersModel.removeGroup(req.params.serial, req.params.group, res.locals.issuer.serial));
  },

  // alternatives
  // --------------------------------------------------------------------------------------------------
  async addAlternative(req: UsersApi.AddAlternativeReq, res: UsersApi.AddAlternativeRes) {
    res.json(await usersModel.addAlternative(req.params.serial, req.params.alternative, res.locals.issuer.serial));
  },

  async removeAlternative(req: UsersApi.RemoveAlternativeReq, res: UsersApi.RemoveAlternativeRes) {
    res.json(await usersModel.removeAlternative(req.params.serial, req.params.alternative, res.locals.issuer.serial));
  },


  // orgunit
  // --------------------------------------------------------------------------------------------------
  async updateUserOrgunit(req: UsersApi.UpdateOrgunitReq, res: UsersApi.UpdateOrgunitRes) {
    res.json(await usersModel.updateOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer.serial));
  }

}