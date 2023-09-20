import { activitiesModel } from "@pestras/backend/models";
import { ActivitiesApi } from "./types";

export const controller = {

  async getLastWeekActs(req: ActivitiesApi.GetLastWeekActsReq, res: ActivitiesApi.GetLastWeekActsRes) {
    res.json(await activitiesModel.getLastWeek(req.params.serial));
  },

  async getLastMonthActs(req: ActivitiesApi.GetLastMonthActsReq, res: ActivitiesApi.GetLastMonthActsRes) {
    res.json(await activitiesModel.getLastMonth(req.params.serial));
  },

  async getLastYearActs(req: ActivitiesApi.GetLastYearActsReq, res: ActivitiesApi.GetLastYearActsRes) {
    res.json(await activitiesModel.getLastYear(req.params.serial));
  }
}