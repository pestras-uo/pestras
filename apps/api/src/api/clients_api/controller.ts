import { clientsApiModel } from "@pestras/backend/models";
import { ClientsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  async getByBlueprint(req: ClientsApi.GetByBlueprintReq, res: ClientsApi.GetByBlueprintRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.getByBlueprint(req.params.blueprint));

    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: ClientsApi.GetBySerialReq, res: ClientsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.getBySerial(req.params.serial));

    } catch (error) {
      next(error);
    }
  },

  async create(req: ClientsApi.CreateReq, res: ClientsApi.CreateRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.create(req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async update(req: ClientsApi.UpdateReq, res: ClientsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.update(req.params.serial, req.body.client_name, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async addIP(req: ClientsApi.AddIPReq, res: ClientsApi.AddIPRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.addIP(req.params.serial, req.body.ip, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async removeIP(req: ClientsApi.RemoveIPReq, res: ClientsApi.RemoveIPRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.removeIP(req.params.serial, req.body.ip, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async addDataStore(req: ClientsApi.AddDataStoreReq, res: ClientsApi.AddDataStoreRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.addDataStore(req.params.serial, req.params.ds, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateDataStore(req: ClientsApi.UpdateDataStoreReq, res: ClientsApi.UpdateDataStoreRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.updateDataStore(req.params.serial, req.params.ds, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async removeDataStore(req: ClientsApi.RemoveDataStoreReq, res: ClientsApi.RemoveDataStoreRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.removeDataStore(req.params.serial, req.params.ds, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async addParam(req: ClientsApi.AddParamReq, res: ClientsApi.AddParamRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.addParam(req.params.serial, req.params.ds, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateParam(req: ClientsApi.UpdateParamReq, res: ClientsApi.UpdateParamRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.updateParam(req.params.serial, req.params.ds, req.params.param, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async removeParam(req: ClientsApi.RemoveParamReq, res: ClientsApi.RemoveParamRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.removeParam(req.params.serial, req.params.ds, req.params.param, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async delete(req: ClientsApi.DeleteReq, res: ClientsApi.DeleteRes, next: NextFunction) {
    try {
      res.json(await clientsApiModel.delete(req.params.serial, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  }
}