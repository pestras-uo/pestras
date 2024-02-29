import { entityAccessModel } from '@pestras/backend/models';
import { EntityAccessApi } from './types';

export const controller = {

  async getByEntity(req: EntityAccessApi.GetByEntityReq, res: EntityAccessApi.GetByEntityRes) {
    res.json(await entityAccessModel.getByEntity(req.params.entity));
  },

  async allowGuests(req: EntityAccessApi.allowGuestsReq, res: EntityAccessApi.allowGuestsRes) {
    res.json(await entityAccessModel.allowGuests(req.params.entity, req.body.allow));
  },

  async addOrgunit(req: EntityAccessApi.AddOrgunitReq, res: EntityAccessApi.AddOrgunitRes) {
    res.json(await entityAccessModel.addOrgunit(req.params.entity, req.params.orgunit));
  },

  async removeOrgunit(req: EntityAccessApi.RemoveOrgunitReq, res: EntityAccessApi.RemoveOrgunitRes) {
    res.json(await entityAccessModel.removeOrgunit(req.params.entity, req.params.orgunit));
  },

  async addUser(req: EntityAccessApi.AddUserReq, res: EntityAccessApi.AddUserRes) {
    res.json(await entityAccessModel.addUser(req.params.entity, req.params.user));
  },

  async removeUser(req: EntityAccessApi.RemoveUserReq, res: EntityAccessApi.RemoveUserRes) {
    res.json(await entityAccessModel.removeUser(req.params.entity, req.params.user));
  },

  async addGroup(req: EntityAccessApi.AddGroupReq, res: EntityAccessApi.AddGroupRes) {
    res.json(await entityAccessModel.addGroup(req.params.entity, req.params.group));
  },

  async removeGroup(req: EntityAccessApi.RemoveGroupReq, res: EntityAccessApi.RemoveGroupRes) {
    res.json(await entityAccessModel.removeGroup(req.params.entity, req.params.group));
  }
}