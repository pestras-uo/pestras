import { recordsWorkflowModel } from "../../models";
import { WorkflowApis } from "./types";

export const controller = {

  async getByRecord(req: WorkflowApis.getByRecordReq, res: WorkflowApis.getByRecordRes) {
    res.json(await recordsWorkflowModel.getByRecord(req.params.ds, req.params.record));
  },

  async publish(req: WorkflowApis.publishReq, res: WorkflowApis.publishRes) {
    res.json(await recordsWorkflowModel.publish(req.params.ds, req.params.record, res.locals.issuer));
  },

  async approve(req: WorkflowApis.approveReq, res: WorkflowApis.approveRes) {
    res.json(await recordsWorkflowModel.approve(req.params.ds, req.params.record, res.locals.issuer));
  },

  async cancel(req: WorkflowApis.cancelReq, res: WorkflowApis.cancelRes) {
    res.json(await recordsWorkflowModel.reject(req.params.ds, req.params.record, res.locals.issuer));
  }
}