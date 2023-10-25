import { ReportsApi } from "./types";
import fs from 'fs-extra';
import path from 'path';
import config from "../../config";
import { HttpCode, HttpError } from "@pestras/backend/util";
import { ReportViewType } from "@pestras/shared/data-model";
import { NextFunction } from 'express';
import { dataVizModel, entityAccessModel, reportsModel } from "@pestras/backend/models";

export const controller = {

  // Read
  // -------------------------------------------------------------------------------
  async getByTopic(req: ReportsApi.GetByTopicReq, res: ReportsApi.GetByTopicRes, next: NextFunction) {
    try {
      res.json(await reportsModel.getByTopic(req.params.topic, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: ReportsApi.GetBySerialReq, res: ReportsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await reportsModel.getBySerial(req.params.serial));

    } catch (error) {
      next(error);
    }
  },


  // Create
  // -------------------------------------------------------------------------------
  async create(req: ReportsApi.CreateReq, res: ReportsApi.CreateRes, next: NextFunction) {
    try {
      const report = await reportsModel.create(req.body, res.locals.issuer);

      await entityAccessModel.create(report.serial);

      res.json(report);

    } catch (error) {
      next(error);
    }
  },


  // Update
  // -------------------------------------------------------------------------------
  async update(req: ReportsApi.UpdateReq, res: ReportsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await reportsModel.update(req.params.serial, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },


  // Slides
  // -------------------------------------------------------------------------------
  async addSlide(req: ReportsApi.AddSlideReq, res: ReportsApi.AddSlideRes, next: NextFunction) {
    try {
      res.json(await reportsModel.addSlide(req.params.serial, req.body.title, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateSlidesOrder(req: ReportsApi.UpdateSlidesOrderReq, res: ReportsApi.UpdateSlidesOrderRes, next: NextFunction) {
    try {
      res.json(await reportsModel.updateSlidesOrder(req.params.serial, req.body.slides, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateSlide(req: ReportsApi.UpdateSlideReq, res: ReportsApi.UpdateSlideRes, next: NextFunction) {
    try {
      res.json(await reportsModel.updateSlide(req.params.serial, req.params.slide, req.body.title, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async removeSlide(req: ReportsApi.RemoveSlideReq, res: ReportsApi.RemoveSlideRes, next: NextFunction) {
    try {
      const report = await reportsModel.getBySerial(req.params.serial, { views: 1 });

      res.json(await reportsModel.removeSlide(req.params.serial, req.params.slide, res.locals.issuer));

      if (report) {
        const views = report.views.filter(v => v.slide === req.params.slide);
        const dataVizViews = views.filter(v => v.type === ReportViewType.DATA_VIZ);
        const imagesViews = views.filter(v => v.type === ReportViewType.IMAGE);

        await dataVizModel.deleteManyDataViz(dataVizViews.map(v => v.content));

        imagesViews.forEach(async v => {
          const img = path.join(config.uploadsDir, 'images', req.params.serial, v.content.slice(v.content.lastIndexOf('/') + 1));

          await fs.remove(img);
        });
      }

    } catch (error) {
      next(error);
    }
  },


  // views
  // -------------------------------------------------------------------------------
  async addView(req: ReportsApi.AddViewReq, res: ReportsApi.AddViewRes, next: NextFunction) {
    try {
      res.json(await reportsModel.addView(req.params.serial, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateViewsOrder(req: ReportsApi.UpdateViewsOrderReq, res: ReportsApi.UpdateViewsOrderRes, next: NextFunction) {
    try {
      res.json(await reportsModel.updateViewsOrder(req.params.serial, req.params.slide, req.body.views, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateView(req: ReportsApi.UpdateViewReq, res: ReportsApi.UpdateViewRes, next: NextFunction) {
    try {
      res.json(await reportsModel.updateView(req.params.serial, req.params.view, req.body, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateViewContent(req: ReportsApi.UpdateViewContentReq, res: ReportsApi.UpdateViewContentRes, next: NextFunction) {
    try {
      res.json(await reportsModel.updateViewContent(req.params.serial, req.params.view, req.body.content, res.locals.issuer));

    } catch (error) {
      next(error);
    }
  },

  async updateViewImageContent(req: ReportsApi.UpdateViewImageContentReq, res: ReportsApi.UpdateViewImageContentRes, next: NextFunction) {
    try {
      const filePath = req.file ? '/uploads/images/' + req.params.serial + '/' + req.file.filename : null;

      if (!filePath)
        throw new HttpError(HttpCode.BAD_REQUEST, 'imageNotFound');

      const report = await reportsModel.getBySerial(req.params.serial, { views: 1 });
      const view = report?.views.find(v => v.serial === req.params.view)

      if (!view)
        throw new HttpError(HttpCode.BAD_REQUEST, 'viewNotFound');

      const currentImage = view.content;

      const date = await reportsModel.updateViewContent(req.params.serial, req.params.view, filePath, res.locals.issuer);

      res.json({ path: filePath, date });

      if (currentImage) {
        const filename = currentImage.slice(currentImage.lastIndexOf('/') + 1);
        await fs.remove(path.join(config.uploadsDir, 'images', req.params.serial, filename));
      }

    } catch (error) {
      next(error);
    }
  },

  async removeView(req: ReportsApi.RemoveViewReq, res: ReportsApi.RemoveViewRes, next: NextFunction) {
    try {
      const report = await reportsModel.getBySerial(req.params.serial, { views: 1 });

      res.json(await reportsModel.removeView(req.params.serial, req.params.view, res.locals.issuer));

      if (report) {
        const view = report.views.find(v => v.serial === req.params.view);

        if (view)
          if (view.type === ReportViewType.DATA_VIZ)
            await dataVizModel.delete(view.content);
          else if (view.type === ReportViewType.IMAGE)
            await fs.remove(path.join(config.uploadsDir, 'images', req.params.serial, view.content.slice(view.content.lastIndexOf('/') + 1)));
      }

    } catch (error) {
      next(error);
    }
  },

  // Delete
  // -------------------------------------------------------------------------------
  async delete(req: ReportsApi.DeleteReq, res: ReportsApi.DeleteRes, next: NextFunction) {
    try {
      res.json(await reportsModel.delete(req.params.serial, res.locals.issuer));

      entityAccessModel.delete(req.params.serial);

    } catch (error) {
      next(error);
    }
  }
}