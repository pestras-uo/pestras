import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { attachmentsModel } from "../../models";
import { AttachmentsApi } from "./types";
import fs from 'fs';
import path from 'path';

export const controller = {

  async getBySerial(req: AttachmentsApi.GetBySerialReq, res: AttachmentsApi.GetBySerialRes) {
    res.json(await attachmentsModel.getBySerial(req.params.serial));
  },

  async getByEntity(req: AttachmentsApi.GetByEntityReq, res: AttachmentsApi.GetByEntityRes) {
    res.json(await attachmentsModel.getByEntity(req.params.entity));
  },

  async create(req: AttachmentsApi.CreateReq, res: AttachmentsApi.CreateRes) {
    const file = req.file ? '/uploads/attachments/' + req.body.entity + '/' + req.file.filename : null;

    if (!file)
      throw new HttpError(HttpCode.NOT_FOUND, 'attachmentNotFound');

    res.json(await attachmentsModel.create({
      entity: req.body.entity,
      name: req.body.name,
      path: file
    }));
  },

  async updateName(req: AttachmentsApi.UpdateNameReq, res: AttachmentsApi.UpdateNameRes) {
    res.json(await attachmentsModel.updateName(req.params.serial, req.body.name));
  },

  async remove(req: AttachmentsApi.RemoveReq, res: AttachmentsApi.RemoveRes) {
    const attachment = await attachmentsModel.getBySerial(req.params.serial);

    if (!attachment)
      return res.json(true);

    const filename = attachment.path.slice(attachment.path.lastIndexOf('/') + 1);
    fs.unlinkSync(path.join(config.uploadsDir, 'attachments', attachment.entity, filename));

    res.json(await attachmentsModel.remove(attachment.serial));
  },

  async removeByEntity(req: AttachmentsApi.RemoveByEntityReq, res: AttachmentsApi.RemoveByEntityRes) {
    res.json(await attachmentsModel.removeByEntity(req.params.entity));
    
    fs.unlinkSync(path.join(config.uploadsDir, 'attachments', req.params.entity));
  }

}