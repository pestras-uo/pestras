import { regionsModel } from "../../models";
import { RegionsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {
  async getAll(_: RegionsApi.GetAllReq, res: RegionsApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await regionsModel.getAll());
      
    } catch (error) {
      next(error);
    }
  },

  async get(req: RegionsApi.GetReq, res: RegionsApi.GetRes, next: NextFunction) {
    try {
      res.json(await regionsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: RegionsApi.CreateReq, res: RegionsApi.CreateRes, next: NextFunction) {
    try {
      res.json(await regionsModel.create(req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async update(req: RegionsApi.UpdateReq, res: RegionsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await regionsModel.update(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async updateCoords(req: RegionsApi.UpdateCoordsReq, res: RegionsApi.UpdateCoordsRes, next: NextFunction) {
    try {
      res.json(await regionsModel.updateCoords(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}