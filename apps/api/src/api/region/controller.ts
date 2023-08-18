import { regionsModel } from "../../models";
import { RegionsApi } from "./types";

export const controller = {
  async getAll(_: RegionsApi.GetAllReq, res: RegionsApi.GetAllRes) {
    res.json(await regionsModel.getAll());
  },

  async get(req: RegionsApi.GetReq, res: RegionsApi.GetRes) {
    res.json(await regionsModel.getBySerial(req.params.serial));
  },

  async create(req: RegionsApi.CreateReq, res: RegionsApi.CreateRes) {
    res.json(await regionsModel.create(req.body, res.locals.issuer.serial));
  },

  async update(req: RegionsApi.UpdateReq, res: RegionsApi.UpdateRes) {
    res.json(await regionsModel.update(req.params.serial, req.body, res.locals.issuer.serial));
  },

  async updateCoords(req: RegionsApi.UpdateCoordsReq, res: RegionsApi.UpdateCoordsRes) {
    res.json(await regionsModel.updateCoords(req.params.serial, req.body, res.locals.issuer.serial));
  }
}