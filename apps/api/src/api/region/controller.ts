import { regionsModel } from "@pestras/backend/models";
import { NextFunction, Request, Response } from 'express';
import { RegionsApi } from '@pestras/shared/data-model';
import { UserSession } from "../../auth";

export const controller = {

  // read
  // ------------------------------------------------------------------------------------
  async getAll(
    _: Request,
    res: Response<RegionsApi.GetAll.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.getAll());

    } catch (error) {
      next(error);
    }
  },

  async get(
    req: Request<RegionsApi.GetBySerial.Params>,
    res: Response<RegionsApi.GetBySerial.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.getBySerial(req.params.serial));

    } catch (error) {
      next(error);
    }
  },

  // create, update
  // ------------------------------------------------------------------------------------
  async create(
    req: Request<unknown, unknown, RegionsApi.Create.Body>,
    res: Response<RegionsApi.Create.Response, UserSession>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.create(req.body, res.locals.issuer.serial));

    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request<RegionsApi.Update.Params, unknown, RegionsApi.Update.Body>,
    res: Response<RegionsApi.Update.Response, UserSession>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.update(req.params.serial, req.body, res.locals.issuer.serial));

    } catch (error) {
      next(error);
    }
  },

  // boundry coords
  // ------------------------------------------------------------------------------------
  async updateCoords(
    req: Request<RegionsApi.UpdateCoords.Params, unknown, RegionsApi.UpdateCoords.Body>,
    res: Response<RegionsApi.UpdateCoords.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.updateCoords(req.params.serial, req.body, res.locals.issuer.serial));

    } catch (error) {
      next(error);
    }
  },

  // Gis Maps
  // ------------------------------------------------------------------------------------
  async addGisMap(
    req: Request<RegionsApi.AddGisMap.Params, unknown, RegionsApi.AddGisMap.Body>,
    res: Response<RegionsApi.AddGisMap.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.addGisMap(req.params.serial, req.body));

    } catch (error) {
      next(error);
    }
  },

  async updateGisMap(
    req: Request<RegionsApi.UpdateGisMap.Params, unknown, RegionsApi.UpdateGisMap.Body>,
    res: Response<RegionsApi.UpdateGisMap.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.updateGisMap(req.params.serial, req.params.map, req.body));

    } catch (error) {
      next(error);
    }
  },

  async updateGisMapApiKey(
    req: Request<RegionsApi.UpdateGisMapApiKey.Params, unknown, RegionsApi.UpdateGisMapApiKey.Body>,
    res: Response<RegionsApi.UpdateGisMapApiKey.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.updateGisMapApiKey(req.params.serial, req.params.map, req.body.apiKey));

    } catch (error) {
      next(error);
    }
  },

  async removeGisMap(
    req: Request<RegionsApi.RemoveGisMap.Params>,
    res: Response<RegionsApi.RemoveGisMap.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.removeGisMap(req.params.serial, req.params.map));

    } catch (error) {
      next(error);
    }
  },

  // Gis Maps Layers
  // ------------------------------------------------------------------------------------
  async addGisMapLayer(
    req: Request<RegionsApi.AddGisMapLayer.Params, unknown, RegionsApi.AddGisMapLayer.Body>,
    res: Response<RegionsApi.AddGisMapLayer.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.addGisMapLayer(req.params.serial, req.params.map, req.body));

    } catch (error) {
      next(error);
    }
  },

  async updateGisMapLayer(
    req: Request<RegionsApi.UpdateGisMapLayer.Params, unknown, RegionsApi.UpdateGisMapLayer.Body>,
    res: Response<RegionsApi.UpdateGisMapLayer.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.updateGisMapLayer(req.params.serial, req.params.map, req.params.layer, req.body));

    } catch (error) {
      next(error);
    }
  },

  async removeGisMapLayer(
    req: Request<RegionsApi.RemoveGisMapLayer.Params>,
    res: Response<RegionsApi.RemoveGisMapLayer.Response>,
    next: NextFunction
  ) {
    try {
      res.json(await regionsModel.removeGisMapLayer(req.params.serial, req.params.map, req.params.layer));

    } catch (error) {
      next(error);
    }
  },
}