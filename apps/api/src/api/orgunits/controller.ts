import { orgunitsModel } from "../../models";
import fs from 'fs';
import path from 'path';
import { OrgunitsApi } from "./types";
import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";

export const OrgunitsController = {

  async getAll(_: OrgunitsApi.GetAllReq, res: OrgunitsApi.GetAllRes) {
    res.json(await orgunitsModel.getAll());
  },

  async get(req: OrgunitsApi.GetReq, res: OrgunitsApi.GetRes) {
    res.json(await orgunitsModel.getBySerial(req.params.serial));
  },

  async create(req: OrgunitsApi.CreateReq, res: OrgunitsApi.CreateRes) {
    const orgunit = await orgunitsModel.create(req.body, res.locals.issuer.serial);

    res.json(orgunit);
  },

  async update(req: OrgunitsApi.UpdateReq, res: OrgunitsApi.UpdateRes) {
    res.json(await orgunitsModel.update(req.params.serial, req.body, res.locals.issuer.serial));
  },

  async updateLogo(req: OrgunitsApi.UpdateLogoReq, res: OrgunitsApi.UpdateLogoRes) {
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
  },

  async removeLogo(req: OrgunitsApi.RemoveReq, res: OrgunitsApi.RemoveRes) {
    const currLogoPath = (await orgunitsModel.getBySerial(req.params.serial, { logo: 1 }))?.logo;

    res.json(await orgunitsModel.updateLogo(req.params.serial, null, res.locals.issuer.serial));

    if (currLogoPath) {
      const filename = currLogoPath.slice(currLogoPath.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'logos', filename));
    }
  }
}