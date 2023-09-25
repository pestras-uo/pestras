import { analysisModel, dashboardsModel, reportsModel } from "@pestras/backend/models";
import { AnalysisApi } from "./types";
import {  NextFunction } from 'express';

export const controller = {

  async getBySerial(req: AnalysisApi.GetBySerialReq, res: AnalysisApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await analysisModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: AnalysisApi.CreateReq, res: AnalysisApi.CreateRes, next: NextFunction) {
    try {
      const analysis = await analysisModel.create(req.body.data, res.locals.issuer.serial);
  
      req.body.entity.type === 'dashboard'
        ? dashboardsModel.updateViewDataViz(req.body.entity.serial, req.body.entity.view, analysis.serial, res.locals.issuer)
        : reportsModel.updateViewContent(req.body.entity.serial, req.body.entity.view, analysis.serial, res.locals.issuer);
  
      res.json(analysis);
      
    } catch (error) {
      next(error);
    }
  },
  
  async update(req: AnalysisApi.UpdateReq, res: AnalysisApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await analysisModel.update(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}