import { blueprintsModel, contentModel } from "@pestras/backend/models";
import { BlueprintsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getAll(_: BlueprintsApi.GetAllReq, res: BlueprintsApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.getAll(res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: BlueprintsApi.GetBySerialReq, res: BlueprintsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: BlueprintsApi.CreateReq, res: BlueprintsApi.CreateRes, next: NextFunction) {
    try {
      const bp = await blueprintsModel.create({ name: req.body.name, orgunit: res.locals.issuer.orgunit }, res.locals.issuer.serial);
  
      await contentModel.create(bp.serial);
  
      res.json(bp);
      
    } catch (error) {
      next(error);
    }
  },

  async update(req: BlueprintsApi.UpdateReq, res: BlueprintsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.update(req.params.serial, req.body.name, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async setOwner(req: BlueprintsApi.SetOwnerReq, res: BlueprintsApi.SetOwnerRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.setOwner(req.params.serial, req.params.owner, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async addCollaborator(req: BlueprintsApi.AddCollaboratorReq, res: BlueprintsApi.AddCollaboratorRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.addCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeCollaborator(req: BlueprintsApi.RemoveCollaboratorReq, res: BlueprintsApi.RemoveCollaboratorRes, next: NextFunction) {
    try {
      res.json(await blueprintsModel.removeCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  }
}