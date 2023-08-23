import config from "../../config";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { attachmentsModel } from "../../models";
import { AttachmentsApi } from "./types";
import fs from 'fs';
import path from 'path';
import { NextFunction } from 'express';

export const controller = {

  async getBySerial(req: AttachmentsApi.GetBySerialReq, res: AttachmentsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await attachmentsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async getByEntity(req: AttachmentsApi.GetByEntityReq, res: AttachmentsApi.GetByEntityRes, next: NextFunction) {
    try {
      res.json(await attachmentsModel.getByEntity(req.params.entity));
      
    } catch (error) {
      next(error);
    }
  },

  async create(req: AttachmentsApi.CreateReq, res: AttachmentsApi.CreateRes, next: NextFunction) {
    try {
      const file = req.file ? '/uploads/attachments/' + req.body.parent + '/' + req.body.entity + '/' + req.file.filename : null;
  
      if (!file)
        throw new HttpError(HttpCode.NOT_FOUND, 'attachmentNotFound');
  
      res.json(await attachmentsModel.create({
        entity: req.body.entity,
        name: req.body.name,
        parent: req.body.parent,
        path: file
      }));
      
    } catch (error) {
      next(error);
    }
  },

  async updateName(req: AttachmentsApi.UpdateNameReq, res: AttachmentsApi.UpdateNameRes, next: NextFunction) {
    try {
      res.json(await attachmentsModel.updateName(req.params.serial, req.body.name));
      
    } catch (error) {
      next(error);
    }
  },

  async remove(req: AttachmentsApi.RemoveReq, res: AttachmentsApi.RemoveRes, next: NextFunction) {
    try {
      const attachment = await attachmentsModel.getBySerial(req.params.serial);
  
      if (!attachment)
        return res.json(true);
  
      const filename = attachment.path.slice(attachment.path.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'attachments', attachment.parent, attachment.entity, filename));
  
      res.json(await attachmentsModel.remove(attachment.serial));
      
    } catch (error) {
      next(error);
    }
  },

  async removeByEntity(req: AttachmentsApi.RemoveByEntityReq, res: AttachmentsApi.RemoveByEntityRes, next: NextFunction) {
    try {
      res.json(await attachmentsModel.removeByEntity(req.params.entity));
      
      fs.unlinkSync(path.join(config.uploadsDir, 'attachments', req.params.parent, req.params.entity));
    } catch (error) {
      next(error);
    }
    
  }

}