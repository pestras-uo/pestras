import { workspaceModel } from "../../models";
import { WorkspaceApi } from "./types";

export const controller = {

  async getByOwner(_: WorkspaceApi.GetByOwnerReq, res: WorkspaceApi.GetByOwnerRes) {
    res.json(await workspaceModel.getByOwner(res.locals.issuer.serial));
  },

  async addGroup(req: WorkspaceApi.AddGroupReq, res: WorkspaceApi.AddGroupRes) {
    res.json(await workspaceModel.addGroup(res.locals.issuer.serial, req.body.name));
  },

  async updateGroup(req: WorkspaceApi.UpdateGroupReq, res: WorkspaceApi.UpdateGroupRes) {
    res.json(await workspaceModel.updateGroup(res.locals.issuer.serial, req.params.group, req.body.name));
  },

  async removeGroup(req: WorkspaceApi.RemoveGroupReq, res: WorkspaceApi.RemoveGroupRes) {
    res.json(await workspaceModel.removeGroup(res.locals.issuer.serial, req.params.group));
  },

  async addPin(req: WorkspaceApi.AddPinReq, res: WorkspaceApi.AddPinRes) {
    res.json(await workspaceModel.addPin(res.locals.issuer.serial, req.body));
  },

  async removePin(req: WorkspaceApi.RemovePinReq, res: WorkspaceApi.RemovePinRes) {
    res.json(await workspaceModel.removePin(res.locals.issuer.serial, req.params.pin));
  },

  async addSlide(req: WorkspaceApi.AddSlideReq, res: WorkspaceApi.AddSlideRes) {
    res.json(await workspaceModel.addSlide(res.locals.issuer.serial, req.body));
  },

  async removeSlide(req: WorkspaceApi.RemoveSlideReq, res: WorkspaceApi.RemoveSlideRes) {
    res.json(await workspaceModel.removeSlide(res.locals.issuer.serial, req.params.slide));
  }
}