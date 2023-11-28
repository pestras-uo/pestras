import fs from 'fs';
import path from 'path';
import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { NextFunction, Request, Response } from 'express';
import { orgunitsModel } from '@pestras/backend/models';
import { OrgunitsApi } from '@pestras/shared/data-model';
import { UserSession } from '../../auth';

export const OrgunitsController = {

  async getAll(
    _: Request,
    res: Response<OrgunitsApi.GetAll.Response, UserSession>,
    next: NextFunction
  ) {
    try {
      res.json(await orgunitsModel.getAll());

    } catch (error) {
      next(error);
    }
  },

  async getBySerial(
    req: Request<OrgunitsApi.GetBySerial.Params>,
    res: Response<OrgunitsApi.GetBySerial.Response, UserSession>,
    next: NextFunction
  ) {
    try {
      res.json(await orgunitsModel.getBySerial(req.params.serial));

    } catch (error) {
      next(error);
    }
  },

  async create(
    req: Request<unknown, unknown, OrgunitsApi.Create.Body>, 
    res: Response<OrgunitsApi.Create.Response, UserSession>, 
    next: NextFunction
  ) {
    try {
      const orgunit = await orgunitsModel.create(req.body, res.locals.issuer.serial);

      res.json(orgunit);

    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request<OrgunitsApi.Update.Params, unknown, OrgunitsApi.Update.Body>, 
    res: Response<OrgunitsApi.Update.Response, UserSession>, 
    next: NextFunction
  ) {
    try {
      res.json(await orgunitsModel.update(req.params.serial, req.body, res.locals.issuer.serial));

    } catch (error) {
      next(error);
    }
  },

  async updateLogo(
    req: Request<OrgunitsApi.UpdateLogo.Params>, 
    res: Response<OrgunitsApi.UpdateLogo.Response, UserSession>,
    next: NextFunction
  ) {
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

  async removeLogo(
    req: Request<OrgunitsApi.RemoveLogo.Params>, 
    res: Response<OrgunitsApi.RemoveLogo.Response, UserSession>,
    next: NextFunction
  ) {
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

  async updateRegions(
    req: Request<OrgunitsApi.UpdateRegions.Params, unknown, OrgunitsApi.UpdateRegions.Body>,
    res: Response<OrgunitsApi.UpdateRegions.Response, UserSession>,
    next: NextFunction
  ) {
    try {
      res.json(await orgunitsModel.updateRegions(req.params.serial, req.body.regions, res.locals.issuer.serial));

    } catch (error) {
      next(error);
    }
  }
}