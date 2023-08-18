import { topicsModel, contentModel } from "../../models";
import { TopicsApi } from "./types";

export const controller = {

  async getByBpReq(req: TopicsApi.GetByBpReq, res: TopicsApi.GetByBpRes) {
    res.json(await topicsModel.getByBlueprint(req.params.bp, res.locals.issuer));
  },

  async getByParentReq(req: TopicsApi.GetByParentReq, res: TopicsApi.GetByParentRes) {
    res.json(await topicsModel.getByParent(req.params.parent, res.locals.issuer));
  },

  async getBySerialReq(req: TopicsApi.GetBySerialReq, res: TopicsApi.GetBySerialRes) {
    res.json(await topicsModel.getBySerial(req.params.serial));
  },

  async create(req: TopicsApi.CreateReq, res: TopicsApi.CreateRes) {
    const topic = await topicsModel.create(req.body, res.locals.issuer);

    await contentModel.create(topic.serial);

    res.json(topic);
  },

  async update(req: TopicsApi.UpdateReq, res: TopicsApi.UpdateRes) {
    res.json(await topicsModel.update(req.params.serial, req.body, res.locals.issuer));
  },


  // access
  // -----------------------------------------------------------------------------
  async addOrgunit(req: TopicsApi.AddOrgunitReq, res: TopicsApi.AddOrgunitRes) {
    res.json(await topicsModel.addAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
  },

  async removeOrgunit(req: TopicsApi.RemoveOrgunitReq, res: TopicsApi.RemoveOrgunitRes) {
    res.json(await topicsModel.removeAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
  },

  async addUser(req: TopicsApi.AddUserReq, res: TopicsApi.AddUserRes) {
    res.json(await topicsModel.addAccessUser(req.params.serial, req.params.user, res.locals.issuer))
  },

  async removeUser(req: TopicsApi.RemoveUserReq, res: TopicsApi.RemoveUserRes) {
    res.json(await topicsModel.removeAccessUser(req.params.serial, req.params.user, res.locals.issuer))
  },

  async addGroup(req: TopicsApi.AddGroupReq, res: TopicsApi.AddGroupRes) {
    res.json(await topicsModel.addAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
  },

  async removeGroup(req: TopicsApi.RemoveGroupReq, res: TopicsApi.RemoveGroupRes) {
    res.json(await topicsModel.removeAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
  }
}