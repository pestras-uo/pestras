import { commentsModel } from "../../models";
import { CommentsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getComments(req: CommentsApi.GetReq, res: CommentsApi.GetRes, next: NextFunction) {
    try {
      res.json(await commentsModel.getComments(req.params.recordSerial, +req.query.skip, +req.query.limit))
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: CommentsApi.CreateReq, res: CommentsApi.CreateRes, next: NextFunction) {
    try {
      res.json(await commentsModel.create(req.params.recordSerial, req.body.text, res.locals.issuer.serial));
      
    } catch (error) {
      next(error); 
    }
  },

  async update(req: CommentsApi.UpdateReq, res: CommentsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await commentsModel.update(req.params.serial, req.body.text, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async delete(req: CommentsApi.DeleteReq, res: CommentsApi.DeleteRes, next: NextFunction) {
    try {
      res.json(await commentsModel.delete(req.params.serial, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}