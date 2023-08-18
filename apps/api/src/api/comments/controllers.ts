import { commentsModel } from "../../models";
import { CommentsApi } from "./types";

export const controller = {

  async getComments(req: CommentsApi.GetReq, res: CommentsApi.GetRes) {
    res.json(await commentsModel.getComments(req.params.recordSerial, +req.query.skip, +req.query.limit))
  },

  async create(req: CommentsApi.CreateReq, res: CommentsApi.CreateRes) {
    res.json(await commentsModel.create(req.params.recordSerial, req.body.text, res.locals.issuer.serial));
  },

  async update(req: CommentsApi.UpdateReq, res: CommentsApi.UpdateRes) {
    res.json(await commentsModel.update(req.params.serial, req.body.text, res.locals.issuer.serial));
  },

  async delete(req: CommentsApi.DeleteReq, res: CommentsApi.DeleteRes) {
    res.json(await commentsModel.delete(req.params.serial, res.locals.issuer.serial));
  }
}