import { analysisModel, dashboardsModel, reportsModel } from "../../models";
import { AnalysisApi } from "./types";

export const controller = {

  async getBySerial(req: AnalysisApi.GetBySerialReq, res: AnalysisApi.GetBySerialRes) {
    res.json(await analysisModel.getBySerial(req.params.serial));
  },

  async create(req: AnalysisApi.CreateReq, res: AnalysisApi.CreateRes) {
    const analysis = await analysisModel.create(req.body.data, res.locals.issuer.serial);

    req.body.entity.type === 'dashboard'
      ? dashboardsModel.updateViewDataViz(req.body.entity.serial, req.body.entity.view, analysis.serial, res.locals.issuer)
      : reportsModel.updateViewContent(req.body.entity.serial, req.body.entity.view, analysis.serial, res.locals.issuer);

    res.json(analysis);
  },
  
  async update(req: AnalysisApi.UpdateReq, res: AnalysisApi.UpdateRes) {
    res.json(await analysisModel.update(req.params.serial, req.body, res.locals.issuer.serial));
  }
}