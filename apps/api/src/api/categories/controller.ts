import { categoriesModel } from "../../models";
import { CategoriesApi } from "./types";

export const CategorriesController = {

  async getAll(_: CategoriesApi.GetAllReq, res: CategoriesApi.GetAllRes) {
    res.json(await categoriesModel.getAll());
  },

  async get(req: CategoriesApi.GetByIdReq, res: CategoriesApi.GetByIdRes) {
    res.json(await categoriesModel.getBySerial(req.params.serial));
  },

  async create(req: CategoriesApi.CreateReq, res: CategoriesApi.CreateRes) {
    res.json(await categoriesModel.create(req.body, res.locals.issuer));
  },

  async update(req: CategoriesApi.UpdateReq, res: CategoriesApi.UpdateRes) {
    res.json(await categoriesModel.update(req.params.serial, req.body, res.locals.issuer.serial));
  },

  async delete(req: CategoriesApi.DeleteReq, res: CategoriesApi.DeleteRes) {
    res.json(await categoriesModel.delete(req.params.serial, res.locals.issuer.serial));
  }
}