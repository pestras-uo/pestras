import { dataVizModel } from "../../models";
import { DataVizApi } from "./types";

export const controller = {

  async getBySerial(req: DataVizApi.GetBySerialReq, res: DataVizApi.GetBySerialRes) {
    res.json(await dataVizModel.getBySerial(req.params.serial));
  },

  async create(req: DataVizApi.CreateReq, res: DataVizApi.CreateRes) {
    res.json(await dataVizModel.create(req.body, res.locals.issuer.serial));
  },
  
  async update(req: DataVizApi.UpdateReq, res: DataVizApi.UpdateRes) {
    res.json(await dataVizModel.update(req.params.serial, req.body, res.locals.issuer.serial));
  }
}