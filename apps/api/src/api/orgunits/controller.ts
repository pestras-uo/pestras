import fs from 'fs';
import path from 'path';
import { OrgunitsApi } from "./types";
import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { NextFunction } from 'express';
import { orgunitsModel } from '@pestras/backend/models';

export const OrgunitsController = {

  async getAll(_: OrgunitsApi.GetAllReq, res: OrgunitsApi.GetAllRes, next: NextFunction) {
    try {
      res.json(await orgunitsModel.getAll());
      
    } catch (error) {
      next(error);
    }
  },

  async get(req: OrgunitsApi.GetReq, res: OrgunitsApi.GetRes, next: NextFunction) {
    try {
      res.json(await orgunitsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: OrgunitsApi.CreateReq, res: OrgunitsApi.CreateRes, next: NextFunction) {
    try {
      const orgunit = await orgunitsModel.create(req.body, res.locals.issuer.serial);
      
      res.json(orgunit);

    } catch (error) {
      next(error);
    }
  },

  async update(req: OrgunitsApi.UpdateReq, res: OrgunitsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await orgunitsModel.update(req.params.serial, req.body, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async updateLogo(req: OrgunitsApi.UpdateLogoReq, res: OrgunitsApi.UpdateLogoRes, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(HttpCode.NOT_FOUND, 'fileNotFound');
  
      const currLogoPath = (await orgunitsModel.getBySerial(req.params.serial, { logo: 1 }))?.logo;
  
      const avatarPath = '/uploads/logos/' + req.file?.filename
      const date = await orgunitsModel.updateLogo(req.params.serial, avatarPath, res.locals.issuer.serial);
  
      res.json({ path: avatarPath, date });
  
      if (currLogoPath) {
        const filename = currLogoPath.slice(currLogoPath.lastIndexOf('/') + 1);
        fs.unlinkSync(path.join(config.uploadsDir, 'logos', filename));
      }
      
    } catch (error) {
      next(error);
    }
  },

  async removeLogo(req: OrgunitsApi.RemoveReq, res: OrgunitsApi.RemoveRes, next: NextFunction) {
    try {
      const currLogoPath = (await orgunitsModel.getBySerial(req.params.serial, { logo: 1 }))?.logo;
  
      res.json(await orgunitsModel.updateLogo(req.params.serial, null, res.locals.issuer.serial));
  
      if (currLogoPath) {
        const filename = currLogoPath.slice(currLogoPath.lastIndexOf('/') + 1);
        fs.unlinkSync(path.join(config.uploadsDir, 'logos', filename));
      }
      
    } catch (error) {
      next(error);
    }
  },

  async updateRegions(req: OrgunitsApi.UpdateRegionsReq, res: OrgunitsApi.UpdateRegionsRes, next: NextFunction) {
    try {
      res.json(await orgunitsModel.updateRegions(req.params.serial, req.body.regions, res.locals.issuer.serial));
      
    } catch (error) {
      next(error);
    }
  }
}