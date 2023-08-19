import { usersGroupsModel } from "../../models";
import { UsersGroupsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getAll(_: UsersGroupsApi.GetAllReq, res: UsersGroupsApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await usersGroupsModel.getAll());
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: UsersGroupsApi.GetBySerialReq, res: UsersGroupsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await usersGroupsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: UsersGroupsApi.CreateReq, res: UsersGroupsApi.CreateRes, next: NextFunction) {
    try {
      res.json(await usersGroupsModel.create(req.body.name, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async update(req: UsersGroupsApi.UpdateReq, res: UsersGroupsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await usersGroupsModel.update(req.params.serial, req.body.name, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async delete(req: UsersGroupsApi.DeleteReq, res: UsersGroupsApi.DeleteRes, next: NextFunction) {
    try {
      res.json(await usersGroupsModel.delete(req.params.serial, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }

}