import { workflowModel } from '@pestras/backend/models';
import { WorkflowApi } from './types';
import { NextFunction } from 'express';

export const controller = {

  async getBySerial(req: WorkflowApi.GetBySerialReq, res: WorkflowApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await workflowModel.getBySerial(req.params.serial));
    } catch (error) {
      next(error);
    }
  },

  async getByBlueprint(req: WorkflowApi.GetByBlueprintReq, res: WorkflowApi.GetByBlueprintRes, next: NextFunction) {
    try {
      res.json(await workflowModel.getByBlueprint(req.params.blueprint));
    } catch (error) {
      next(error);
    }
  },

  async create(req: WorkflowApi.CreateReq, res: WorkflowApi.CreateRes, next: NextFunction) {
    try {
      res.json(await workflowModel.create(req.body));
    } catch (error) {
      next(error);
    }
  },

  async updateName(req: WorkflowApi.UpdateNameReq, res: WorkflowApi.UpdateNameRes, next: NextFunction) {
    try {
      res.json(await workflowModel.updateName(req.params.serial, req.body.name));
    } catch (error) {
      next(error);
    }
  },

  async updateSteps(req: WorkflowApi.UpdateStepsReq, res: WorkflowApi.UpdateStepsRes, next: NextFunction) {
    try {
      res.json(await workflowModel.updateSteps(req.params.serial, req.body.steps));
    } catch (error) {
      next(error);
    }
  }
}