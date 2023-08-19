import { dataVizModel } from "../../models";
import { DataVizApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getBySerial(req: DataVizApi.GetBySerialReq, res: DataVizApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await dataVizModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: DataVizApi.CreateReq, res: DataVizApi.CreateRes, next: NextFunction) {
    try {
      res.json(await dataVizModel.create(req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },
  
  async update(req: DataVizApi.UpdateReq, res: DataVizApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await dataVizModel.update(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}