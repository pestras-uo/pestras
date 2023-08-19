import { dataRecordsModel, dataStoresModel } from "../../../models";
import fs from 'fs';
import path from 'path';
import config from "../../../config";
import { RecordsApi } from "./types";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { DataStore } from "@pestras/shared/data-model";
import { NextFunction } from 'express';

export const controller = {

  // read
  // -------------------------------------------------------------------------------------------------
  async search(req: RecordsApi.SearchReq, res: RecordsApi.SearchRes, next: NextFunction) {
    try {
      res.json(await dataRecordsModel.search(req.params.serial, req.body));
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: RecordsApi.GetBySerialReq, res: RecordsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await dataRecordsModel.getBySerial(req.params.serial, req.params.record));
      
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: RecordsApi.GetHistoryReq, res: RecordsApi.GetHistoryRes, next: NextFunction) {
    try {
      res.json(await dataRecordsModel.getHistory(req.params.serial, req.params.record));
      
    } catch (error) {
      next(error);
    }
  },

  // create
  // -------------------------------------------------------------------------------------------------
  async create(req: RecordsApi.CreateReq, res: RecordsApi.CreateRes, next: NextFunction) {
    try {
      const ds: DataStore | null = await dataStoresModel.getBySerial(req.params.serial, { type: 1, settings: 1, fields: 1, state: 1 });
      
      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');
  
      const files = req.files as Express.Multer.File[] | undefined;
  
      if (files)
        for (const file of files)
          req.body[file.fieldname] = `/uploads/images/${req.params.serial}/${file.filename}`;
  
      res.json(await dataRecordsModel.create(ds, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  // update
  // -------------------------------------------------------------------------------------------------
  async update(req: RecordsApi.UpdateReq, res: RecordsApi.UpdateRes, next: NextFunction) {
    try {
      const ds: DataStore | null = await dataStoresModel.getBySerial(req.params.serial, { type: 1, settings: 1, fields: 1, state: 1 });
      
      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');
  
      const record = await dataRecordsModel.getBySerial(req.params.serial, req.params.record);
      const imgsToRemove: string[] = [];
  
      if (!record)
        throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');
  
      const files = req.files as Express.Multer.File[] | undefined;
  
      if (files) {
        for (const file of files) {
          imgsToRemove.push(file.fieldname);
          req.body.data[file.fieldname] = `/uploads/images/${req.params.serial}/${file.filename}`;
        }
      }
  
      res.json(await dataRecordsModel.update(ds, req.params.record, req.body, res.locals.issuer.serial));
  
      for (const field of imgsToRemove) {
        const image = record[field];
  
        if (image) {
          const filename = image.slice(image.lastIndexOf('/') + 1);
          fs.unlinkSync(path.join(config.uploadsDir, 'images', filename));
        }
  
      }

    } catch (error) {
      next(error);
    }
  },

  // delete
  // -------------------------------------------------------------------------------------------------
  async delete(req: RecordsApi.DeleteReq, res: RecordsApi.DeleteRes, next: NextFunction) {
    try {
      const ds: DataStore | null = await dataStoresModel.getBySerial(req.params.serial, { type: 1, owner: 1, fields: 1, settings: 1 });
  
      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');
  
      const record = await dataRecordsModel.getBySerial(req.params.serial, req.params.record);
  
      if (!record)
        return res.json(true);
  
      const fields = await dataStoresModel.getFields(req.params.serial);
  
      res.json(await dataRecordsModel.delete(ds, req.params.record, res.locals.issuer));
  
      for (const f of fields.filter(f => f.type === 'image')) {
        const image = record[f.name];
  
        if (image) {
          const filename = image.slice(image.lastIndexOf('/') + 1);
          fs.unlinkSync(path.join(config.uploadsDir, 'images', req.params.serial, filename));
        }
      }
  
      // delete attachments
      fs.unlinkSync(path.join(config.uploadsDir, 'attachments', req.params.record));
      
    } catch (error) {
      next(error);
    }
  }
}