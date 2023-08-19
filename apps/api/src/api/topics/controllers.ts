import { topicsModel, contentModel } from "../../models";
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
  },


  // access
  // -----------------------------------------------------------------------------
  async addOrgunit(req: TopicsApi.AddOrgunitReq, res: TopicsApi.AddOrgunitRes, next: NextFunction) {
    try {
      res.json(await topicsModel.addAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeOrgunit(req: TopicsApi.RemoveOrgunitReq, res: TopicsApi.RemoveOrgunitRes, next: NextFunction) {
    try {
      res.json(await topicsModel.removeAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async addUser(req: TopicsApi.AddUserReq, res: TopicsApi.AddUserRes, next: NextFunction) {
    try {
      res.json(await topicsModel.addAccessUser(req.params.serial, req.params.user, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeUser(req: TopicsApi.RemoveUserReq, res: TopicsApi.RemoveUserRes, next: NextFunction) {
    try {
      res.json(await topicsModel.removeAccessUser(req.params.serial, req.params.user, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async addGroup(req: TopicsApi.AddGroupReq, res: TopicsApi.AddGroupRes, next: NextFunction) {
    try {
      res.json(await topicsModel.addAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeGroup(req: TopicsApi.RemoveGroupReq, res: TopicsApi.RemoveGroupRes, next: NextFunction) {
    try {
      res.json(await topicsModel.removeAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  }
}