import { contentModel, entityAccessModel, topicsModel } from "@pestras/backend/models";
import { TopicsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByBpReq(req: TopicsApi.GetByBpReq, res: TopicsApi.GetByBpRes, next: NextFunction) {
    try {
      res.json(await topicsModel.getByBlueprint(req.params.bp, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async getByParentReq(req: TopicsApi.GetByParentReq, res: TopicsApi.GetByParentRes, next: NextFunction) {
    try {
      res.json(await topicsModel.getByParent(req.params.parent, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerialReq(req: TopicsApi.GetBySerialReq, res: TopicsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await topicsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: TopicsApi.CreateReq, res: TopicsApi.CreateRes, next: NextFunction) {
    try {
      const topic = await topicsModel.create(req.body, res.locals.issuer);
  
      await contentModel.create(topic.serial);
      await entityAccessModel.create(topic.serial);
  
      res.json(topic);
      
    } catch (error) {
      next(error);  
    }
  },

  async update(req: TopicsApi.UpdateReq, res: TopicsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await topicsModel.update(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  }
}