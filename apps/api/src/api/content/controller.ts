import { ContentViewType } from "@pestras/shared/data-model";
import { HttpError, HttpCode } from "@pestras/backend/util";
import { contentModel } from "../../models";
import { ContentViewsApi } from "./types";
import config from "../../config";
import fs from 'fs';
import path from 'path';

export const controller = {

  async getByEntity(req: ContentViewsApi.GetByEntityReq, res: ContentViewsApi.GetByEntityRes) {
    res.json(await contentModel.getByEntity(req.params.entity))
  },

  async addView(req: ContentViewsApi.AddViewReq, res: ContentViewsApi.AddViewRes) {
    const file = req.file ? `/uploads/images/${req.file.filename}` : null;

    if (file)
      req.body.content = file;

    res.json(await contentModel.addView(req.params.entity, {
      title: req.body.title,
      sub_title: req.body.sub_title,
      type: req.body.type,
      content: req.body.content
    }));
  },

  async updateViewsOrder(req: ContentViewsApi.UpdateViewsOrderReq, res: ContentViewsApi.UpdateViewsOrderRes) {
    res.json(await contentModel.updateViewsOrder(req.params.entity, req.body.views));
  },

  async updateView(req: ContentViewsApi.UpdateViewReq, res: ContentViewsApi.UpdateViewRes) {
    res.json(await contentModel.updateView(req.params.entity, req.params.view, req.body));
  },

  async updateViewContent(req: ContentViewsApi.UpdateViewContentReq, res: ContentViewsApi.UpdateViewContentRes) {
    const view = await contentModel.getView(req.params.entity, req.params.view);

    if (!view)
      throw new HttpError(HttpCode.NOT_FOUND, 'viewNotFound');

    const file = req.file ? `/uploads/images/${req.file.filename}` : null;

    if (file)
      req.body.content = file;

    await contentModel.updateViewContent(req.params.entity, req.params.view, req.body.content)

    res.json(file);

    if (view.type === ContentViewType.IMAGE && view.content) {
      const filename = view.content.slice(view.content.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'images', filename));
    }
  },

  async removeView(req: ContentViewsApi.RemoveViewReq, res: ContentViewsApi.RemoveViewRes) {
    const view = await contentModel.getView(req.params.entity, req.params.view);

    if (!view)
      return res.json(true);

    res.json(await contentModel.removeView(req.params.entity, req.params.view));

    if (view.type === ContentViewType.IMAGE && view.content) {
      const filename = view.content.slice(view.content.lastIndexOf('/') + 1);
      fs.unlinkSync(path.join(config.uploadsDir, 'images', filename));
    }
  }
}