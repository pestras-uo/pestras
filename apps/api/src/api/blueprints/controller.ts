import { blueprintsModel, contentModel } from "../../models";
import { BlueprintsApi } from "./types";

export const controller = {

  async getAll(_: BlueprintsApi.GetAllReq, res: BlueprintsApi.GetAllRes) {
    res.json(await blueprintsModel.getAll(res.locals.issuer));
  },

  async getBySerial(req: BlueprintsApi.GetBySerialReq, res: BlueprintsApi.GetBySerialRes) {
    res.json(await blueprintsModel.getBySerial(req.params.serial));
  },

  async create(req: BlueprintsApi.CreateReq, res: BlueprintsApi.CreateRes) {
    const bp = await blueprintsModel.create({ name: req.body.name, orgunit: res.locals.issuer.orgunit }, res.locals.issuer.serial);

    await contentModel.create(bp.serial);

    res.json(bp);
  },

  async update(req: BlueprintsApi.UpdateReq, res: BlueprintsApi.UpdateRes) {
    res.json(await blueprintsModel.update(req.params.serial, req.body.name, res.locals.issuer));
  },

  async setOwner(req: BlueprintsApi.SetOwnerReq, res: BlueprintsApi.SetOwnerRes) {
    res.json(await blueprintsModel.setOwner(req.params.serial, req.params.owner, res.locals.issuer));
  },

  async addCollaborator(req: BlueprintsApi.AddCollaboratorReq, res: BlueprintsApi.AddCollaboratorRes) {
    res.json(await blueprintsModel.addCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
  },

  async removeCollaborator(req: BlueprintsApi.RemoveCollaboratorReq, res: BlueprintsApi.RemoveCollaboratorRes) {
    res.json(await blueprintsModel.removeCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
  }
}