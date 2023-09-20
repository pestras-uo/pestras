import { recordsWorkflowModel } from "@pestras/backend/models";
import { RecordWorkflowApis } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByRecord(req: RecordWorkflowApis.getByRecordReq, res: RecordWorkflowApis.getByRecordRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.getByRecord(req.params.ds, req.params.record));

    } catch (error) {
      next(error);
    }
  },

  async getRecordWfState(req: RecordWorkflowApis.getRecordWfStateReq, res: RecordWorkflowApis.getRecordWfStateRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.getRecordWfState(req.params.ds, req.params.record));

    } catch (error) {
      next(error);
    }
  },

  async publish(req: RecordWorkflowApis.publishReq, res: RecordWorkflowApis.publishRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.publish(req.params.ds, req.params.record, req.params.trigger));

    } catch (error) {
      next(error);
    }
  },

  async approve(req: RecordWorkflowApis.approveReq, res: RecordWorkflowApis.approveRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.approve(req.params.ds, req.params.record, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async reject(req: RecordWorkflowApis.cancelReq, res: RecordWorkflowApis.cancelRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.reject(req.params.ds, req.params.record, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async cancel(req: RecordWorkflowApis.cancelReq, res: RecordWorkflowApis.cancelRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.cancel(req.params.ds, req.params.record));

    } catch (error) {
      next(error);
    }
  }
}