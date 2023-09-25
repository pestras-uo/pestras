import { workspaceModel } from "@pestras/backend/models";
import { WorkspaceApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByOwner(_: WorkspaceApi.GetByOwnerReq, res: WorkspaceApi.GetByOwnerRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.getByOwner(res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async addGroup(req: WorkspaceApi.AddGroupReq, res: WorkspaceApi.AddGroupRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.addGroup(res.locals.issuer.serial, req.body.name));
      
    } catch (error) {
      next(error);
    }
  },

  async updateGroup(req: WorkspaceApi.UpdateGroupReq, res: WorkspaceApi.UpdateGroupRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.updateGroup(res.locals.issuer.serial, req.params.group, req.body.name));
      
    } catch (error) {
      next(error);
    }
  },

  async removeGroup(req: WorkspaceApi.RemoveGroupReq, res: WorkspaceApi.RemoveGroupRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.removeGroup(res.locals.issuer.serial, req.params.group));
      
    } catch (error) {
      next(error);
    }
  },

  async addPin(req: WorkspaceApi.AddPinReq, res: WorkspaceApi.AddPinRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.addPin(res.locals.issuer.serial, req.body));
      
    } catch (error) {
      next(error);
    }
  },

  async removePin(req: WorkspaceApi.RemovePinReq, res: WorkspaceApi.RemovePinRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.removePin(res.locals.issuer.serial, req.params.pin));
      
    } catch (error) {
      next(error);
    }
  },

  async addSlide(req: WorkspaceApi.AddSlideReq, res: WorkspaceApi.AddSlideRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.addSlide(res.locals.issuer.serial, req.body));
      
    } catch (error) {
      next(error);
    }
  },

  async removeSlide(req: WorkspaceApi.RemoveSlideReq, res: WorkspaceApi.RemoveSlideRes, next: NextFunction) {
    try {
      res.json(await workspaceModel.removeSlide(res.locals.issuer.serial, req.params.slide));
      
    } catch (error) {
      next(error);
    }
  }
}