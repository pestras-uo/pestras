import { contentModel, dataVizModel, reportsModel } from "../../models";
import { ReportsApi } from "./types";
import fs from 'fs';
import path from 'path';
import config from "../../config";
import { HttpCode, HttpError } from "@pestras/backend/util";
import { ReportViewType } from "@pestras/shared/data-model";

export const controller = {


  // Read
  // -------------------------------------------------------------------------------
  async getByTopic(req: ReportsApi.GetByTopicReq, res: ReportsApi.GetByTopicRes) {
    res.json(await reportsModel.getByTopic(req.params.topic, res.locals.issuer));
  },

  async getBySerial(req: ReportsApi.GetBySerialReq, res: ReportsApi.GetBySerialRes) {
    res.json(await reportsModel.getBySerial(req.params.serial));
  },


  // Create
  // -------------------------------------------------------------------------------
  async create(req: ReportsApi.CreateReq, res: ReportsApi.CreateRes) {
    const report = await reportsModel.create(req.body, res.locals.issuer);
    await contentModel.create(report.serial);
    res.json();
  },


  // Update
  // -------------------------------------------------------------------------------
  async update(req: ReportsApi.UpdateReq, res: ReportsApi.UpdateRes) {
    res.json(await reportsModel.update(req.params.serial, req.body, res.locals.issuer));
  },


  // Slides
  // -------------------------------------------------------------------------------
  async addSlide(req: ReportsApi.AddSlideReq, res: ReportsApi.AddSlideRes) {
    res.json(await reportsModel.addSlide(req.params.serial, req.body.title, res.locals.issuer));
  },

  async updateSlidesOrder(req: ReportsApi.UpdateSlidesOrderReq, res: ReportsApi.UpdateSlidesOrderRes) {
    res.json(await reportsModel.updateSlidesOrder(req.params.serial, req.body.slides, res.locals.issuer));
  },

  async updateSlide(req: ReportsApi.UpdateSlideReq, res: ReportsApi.UpdateSlideRes) {
    res.json(await reportsModel.updateSlide(req.params.serial, req.params.slide, req.body.title, res.locals.issuer));
  },

  async removeSlide(req: ReportsApi.RemoveSlideReq, res: ReportsApi.RemoveSlideRes) {
    const report = await reportsModel.getBySerial(req.params.serial, { views: 1 });

    res.json(await reportsModel.removeSlide(req.params.serial, req.params.slide, res.locals.issuer));

    if (report) {
      const views = report.views.filter(v => v.slide === req.params.slide);
      const dataVizViews = views.filter(v => v.type === ReportViewType.DATA_VIZ);
      const imagesViews = views.filter(v => v.type === ReportViewType.IMAGE);

      await dataVizModel.deleteManyDataViz(dataVizViews.map(v => v.content));

      imagesViews.forEach(v => {
        const filename = v.content.slice(v.content.lastIndexOf('/') + 1);
        fs.unlinkSync(path.join(config.uploadsDir, 'images', filename));
      });
    }
  },


  // views
  // -------------------------------------------------------------------------------
  async addView(req: ReportsApi.AddViewReq, res: ReportsApi.AddViewRes) {
    res.json(await reportsModel.addView(req.params.serial, req.body, res.locals.issuer));
  },

  async updateViewsOrder(req: ReportsApi.UpdateViewsOrderReq, res: ReportsApi.UpdateViewsOrderRes) {
    res.json(await reportsModel.updateViewsOrder(req.params.serial, req.params.slide, req.body.views, res.locals.issuer));
  },

  async updateView(req: ReportsApi.UpdateViewReq, res: ReportsApi.UpdateViewRes) {
    res.json(await reportsModel.updateView(req.params.serial, req.params.view, req.body, res.locals.issuer));
  },

  async updateViewContent(req: ReportsApi.UpdateViewContentReq, res: ReportsApi.UpdateViewContentRes) {
    res.json(await reportsModel.updateViewContent(req.params.serial, req.params.view, req.body.content, res.locals.issuer));
  },

  async updateViewImageContent(req: ReportsApi.UpdateViewImageContentReq, res: ReportsApi.UpdateViewImageContentRes) {
    const filePath = req.file ? '/uploads/images/' + req.file.filename : null;

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
      fs.unlinkSync(path.join(config.uploadsDir, 'images', filename));
    }
  },

  async removeView(req: ReportsApi.RemoveViewReq, res: ReportsApi.RemoveViewRes) {
    const report = await reportsModel.getBySerial(req.params.serial, { views: 1 });

    res.json(await reportsModel.removeView(req.params.serial, req.params.view, res.locals.issuer));

    if (report) {
      const view = report.views.find(v => v.serial === req.params.view);

      if (view && view.type === ReportViewType.DATA_VIZ)
        dataVizModel.delete(view.content);
    }
  },


  // access
  // -----------------------------------------------------------------------------
  async addOrgunit(req: ReportsApi.AddOrgunitReq, res: ReportsApi.AddOrgunitRes) {
    res.json(await reportsModel.addAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
  },

  async removeOrgunit(req: ReportsApi.RemoveOrgunitReq, res: ReportsApi.RemoveOrgunitRes) {
    res.json(await reportsModel.removeAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
  },

  async addUser(req: ReportsApi.AddUserReq, res: ReportsApi.AddUserRes) {
    res.json(await reportsModel.addAccessUser(req.params.serial, req.params.user, res.locals.issuer))
  },

  async removeUser(req: ReportsApi.RemoveUserReq, res: ReportsApi.RemoveUserRes) {
    res.json(await reportsModel.removeAccessUser(req.params.serial, req.params.user, res.locals.issuer))
  },

  async addGroup(req: ReportsApi.AddGroupReq, res: ReportsApi.AddGroupRes) {
    res.json(await reportsModel.addAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
  },

  async removeGroup(req: ReportsApi.RemoveGroupReq, res: ReportsApi.RemoveGroupRes) {
    res.json(await reportsModel.removeAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
  },

  // Delete
  // -------------------------------------------------------------------------------
  async delete(req: ReportsApi.DeleteReq, res: ReportsApi.DeleteRes) {
    res.json(await reportsModel.delete(req.params.serial, res.locals.issuer));
    contentModel.delete(req.params.serial);
  }
}