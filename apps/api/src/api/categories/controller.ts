import { categoriesModel } from "@pestras/backend/models";
import { CategoriesApi } from "./types";
import { NextFunction } from 'express';

export const CategorriesController = {

  async getAll(_: CategoriesApi.GetAllReq, res: CategoriesApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.getAll());
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: CategoriesApi.GetByIdReq, res: CategoriesApi.GetByIdRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async getByBlueprint(req: CategoriesApi.GetByBlueprintReq, res: CategoriesApi.GetByBlueprintRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.getByBlueprint(req.params.bp));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: CategoriesApi.CreateReq, res: CategoriesApi.CreateRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.create(req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async update(req: CategoriesApi.UpdateReq, res: CategoriesApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.update(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async delete(req: CategoriesApi.DeleteReq, res: CategoriesApi.DeleteRes, next: NextFunction) {
    try {
      res.json(await categoriesModel.delete(req.params.serial, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}