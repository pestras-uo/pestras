import fs from 'fs-extra';
import path from 'path';
import config from "../../../config";
import { RecordsApi } from "./types";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { DataStore, Field } from "@pestras/shared/data-model";
import { NextFunction } from 'express';
import { Serial } from "@pestras/shared/util";
import { dataRecordsModel, dataStoresModel } from '@pestras/backend/models';

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

  async getCategoryValues(req: RecordsApi.GetCategoryValuesReq, res: RecordsApi.GetCategoryValuesRes, next: NextFunction) {
    try {
      res.json(await dataRecordsModel.getCategoryValues(req.params.serial, req.body.field, req.body.search));
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
      const serial = Serial.gen("RCD");
      const files = req.files as Express.Multer.File[] | undefined;

      if (files && files.length) {
        const paths: Record<string, string> = {};

        for (const file of files) {
          const tmpPath = path.join(config.uploadsDir, 'tmp');
          const destPath = path.join(config.uploadsDir, 'fields', req.params.serial, serial)

          await fs.copy(tmpPath, destPath);

          paths[file.fieldname] = `/uploads/fields/${req.params.serial}/${serial}/${file.filename}`;

          await fs.remove(path.join(tmpPath, file.filename));
        }

        Object.assign(req.body, paths);
      }

      res.json(await dataRecordsModel.create(req.params.serial, serial, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  // update
  // -------------------------------------------------------------------------------------------------
  async update(req: RecordsApi.UpdateReq, res: RecordsApi.UpdateRes, next: NextFunction) {
    try {
      const ds: DataStore | null = await dataStoresModel.getBySerial(req.params.serial, { settings: 1 });
      const draft = !!(+req.params.draft);

      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

      const src = draft ?  `draft_${req.params.serial}` : req.params.serial;
      const record = await dataRecordsModel.getBySerial(src, req.params.record);
      const imgsToRemove: string[] = [];

      if (!record)
        throw new HttpError(HttpCode.NOT_FOUND, 'recordNotFound');

      const files = req.files as Express.Multer.File[] | undefined;

      if (files) {
        const paths: Record<string, string> = {};

        for (const file of files) {
          const tmpPath = path.join(config.uploadsDir, 'tmp');
          const destPath = path.join(config.uploadsDir, 'fields', req.params.serial, req.params.record);

          await fs.copy(tmpPath, destPath);
          paths[file.fieldname] = `/uploads/fields/${req.params.serial}/${req.params.record}/${file.filename}`;

          await fs.remove(path.join(tmpPath, file.filename));

          imgsToRemove.push(file.fieldname);
        }

        Object.assign(req.body, paths);
      }

      res.json(await dataRecordsModel.update(req.params.serial, req.params.record, draft, req.body, res.locals.issuer.serial));

      // if data store doesnot support history then remove changed images
      if (!ds.settings.history) {
        for (const field of imgsToRemove) {
          const image = record[field];

          if (image) {
            const filename = image.slice(image.lastIndexOf('/') + 1);
            await fs.unlink(path.join(config.uploadsDir, 'fields', req.params.serial, req.params.record, filename));
          }
        }
      }

    } catch (error) {
      next(error);
    }
  },

  // history
  // -------------------------------------------------------------------------------------------------
  async revertHistory(req: RecordsApi.RevertHistoryReq, res: RecordsApi.RevertHistoryRes) {
    return res.json(await dataRecordsModel.revertHistory(req.params.serial, req.params.history));
  },

  // delete
  // -------------------------------------------------------------------------------------------------
  async delete(req: RecordsApi.DeleteReq, res: RecordsApi.DeleteRes, next: NextFunction) {
    try {
      const ds: DataStore | null = await dataStoresModel.getBySerial(req.params.serial, { type: 1, owner: 1, fields: 1, settings: 1 });
      const isDraft = !!+req.params.draft;

      if (!ds)
        throw new HttpError(HttpCode.NOT_FOUND, 'dataStoreNotFound');

      const src = isDraft ? `'draft'_${req.params.serial}` : req.params.serial;
      const record = await dataRecordsModel.getBySerial(src, req.params.record);

      if (!record)
        return res.json(true);

      const fields = await dataStoresModel.getFields(req.params.serial);

      res.json(await dataRecordsModel.delete(req.params.serial, req.params.record, isDraft, res.locals.issuer, req.body.message));

      if (!isDraft && typeof ds.settings.workflow.delete !== 'string') {
        // remove images
        for (const f of fields.filter((f: Field) => f.type === 'image')) {
          const image = record[f.name];
  
          if (image) {
            const filename = image.slice(image.lastIndexOf('/') + 1);
            await fs.remove(path.join(config.uploadsDir, 'fields', req.params.serial, filename));
          }
        }
  
        // delete attachments
        fs.unlinkSync(path.join(config.uploadsDir, 'attachments', req.params.serial, req.params.record));
      }

    } catch (error) {
      next(error);
    }
  }
}