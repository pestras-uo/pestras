import { recordsWorkflowModel } from "../../models";
import { WorkflowApis } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByRecord(req: WorkflowApis.getByRecordReq, res: WorkflowApis.getByRecordRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.getByRecord(req.params.ds, req.params.record));
      
    } catch (error) {
      next(error);
    }
  },

  async publish(req: WorkflowApis.publishReq, res: WorkflowApis.publishRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.publish(req.params.ds, req.params.record, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async approve(req: WorkflowApis.approveReq, res: WorkflowApis.approveRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.approve(req.params.ds, req.params.record, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async cancel(req: WorkflowApis.cancelReq, res: WorkflowApis.cancelRes, next: NextFunction) {
    try {
      res.json(await recordsWorkflowModel.reject(req.params.ds, req.params.record, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  }
}