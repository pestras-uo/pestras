import { recordsWorkflowModel } from "@pestras/backend/models";
import { RecordWorkflowApis } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByRecord(req: RecordWorkflowApis.GetByRecordReq, res: RecordWorkflowApis.GetByRecordRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.getByRecord(req.params.ds, req.params.record));

    } catch (error) {
      next(error);
    }
  },

  async getRecordActiveWfState(req: RecordWorkflowApis.GetRecordActiveWfReq, res: RecordWorkflowApis.GetRecordActiveWfRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.getRecordActiveWf(req.params.ds, req.params.record));

    } catch (error) {
      next(error);
    }
  },

  async publish(req: RecordWorkflowApis.PublishReq, res: RecordWorkflowApis.PublishRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.publish(req.params.ds, req.params.record, req.params.trigger, res.locals.issuer, req.body.message));

    } catch (error) {
      next(error);
    }
  },

  async approve(req: RecordWorkflowApis.ApproveReq, res: RecordWorkflowApis.ApproveRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.approve(req.params.ds, req.params.record, req.params.step, req.body.message, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async reject(req: RecordWorkflowApis.RejectReq, res: RecordWorkflowApis.RejectRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.reject(req.params.ds, req.params.record, req.params.step, req.body.message, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  }
}