import { contentModel, dashboardsModel, dataVizModel } from "../../models";
import { DashboardsApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  // Read
  // -------------------------------------------------------------------------------
  async search(req: DashboardsApi.SearchReq, res: DashboardsApi.SearchRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.search(req.body));
      
    } catch (error) {
      next(error);
    }
  },

  async getByTopic(req: DashboardsApi.GetByTopicReq, res: DashboardsApi.GetByTopicRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.getByTopic(req.params.topic, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: DashboardsApi.GetBySerialReq, res: DashboardsApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  // Create
  // -------------------------------------------------------------------------------
  async create(req: DashboardsApi.CreateReq, res: DashboardsApi.CreateRes, next: NextFunction) {
    try {
      const db = await dashboardsModel.create(req.body, res.locals.issuer);
      await contentModel.create(db.serial);
  
      res.json(db);
      
    } catch (error) {
      next(error);
    }
  },

  // Update
  // -------------------------------------------------------------------------------
  async update(req: DashboardsApi.UpdateReq, res: DashboardsApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.update(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },


  // Slides
  // -------------------------------------------------------------------------------
  async addSlide(req: DashboardsApi.AddSlideReq, res: DashboardsApi.AddSlideRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.addSlide(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateSlidesOrder(req: DashboardsApi.UpdateSlidesOrderReq, res: DashboardsApi.UpdateSlidesOrderRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.updateSlidesOrder(req.params.serial, req.body.slides, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateSlide(req: DashboardsApi.UpdateSlideReq, res: DashboardsApi.UpdateSlideRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.updateSlide(req.params.serial, req.params.slide, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeSlide(req: DashboardsApi.RemoveSlideReq, res: DashboardsApi.RemoveSlideRes, next: NextFunction) {
    try {
      const dashboard = await dashboardsModel.getBySerial(req.params.serial, { views: 1 });
      
      res.json(await dashboardsModel.removeSlide(req.params.serial, req.params.slide, res.locals.issuer));
  
      if (dashboard) {
        const views = dashboard.views.filter(v => v.slide === req.params.slide);
  
        dataVizModel.deleteManyDataViz(views.map(v => v.data_viz));
      }

    } catch (error) {
      next(error);
    }
  },

  // Slides Views
  // -------------------------------------------------------------------------------
  async addView(req: DashboardsApi.AddViewReq, res: DashboardsApi.AddViewRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.addView(
        req.params.serial,
        req.body,
        res.locals.issuer
      ));
      
    } catch (error) {
      next(error);
    }
  },

  async updateViewsOrder(req: DashboardsApi.UpdateViewsOrderReq, res: DashboardsApi.UpdateViewsOrderRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.updateViewsOrder(req.params.serial, req.params.slide, req.body.views, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateView(req: DashboardsApi.UpdateViewReq, res: DashboardsApi.UpdateViewRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.updateView(
        req.params.serial,
        req.params.view,
        req.body,
        res.locals.issuer
      ));
      
    } catch (error) {
      next(error);
    }
  },

  async updateViewDataViz(req: DashboardsApi.UpdateViewDataVizReq, res: DashboardsApi.UpdateViewDataVizRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.updateViewDataViz(
        req.params.serial,
        req.params.view,
        req.params.dataViz,
        res.locals.issuer
      ));
      
    } catch (error) {
      next(error);
    }
  },

  async removeView(req: DashboardsApi.RemoveViewReq, res: DashboardsApi.RemoveViewRes, next: NextFunction) {
    try {
      const dashboard = await dashboardsModel.getBySerial(req.params.serial, { views: 1 });
  
      res.json(await dashboardsModel.removeView(
        req.params.serial,
        req.params.view,
        res.locals.issuer
      ));
      
      if (dashboard) {
        const view = dashboard.views.find(v => v.serial === req.params.view);
  
        if (view)
          dataVizModel.delete(view.data_viz);
      }

    } catch (error) {
      next(error);
    }
  },


  // access
  // -----------------------------------------------------------------------------
  async addOrgunit(req: DashboardsApi.AddOrgunitReq, res: DashboardsApi.AddOrgunitRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.addAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeOrgunit(req: DashboardsApi.RemoveOrgunitReq, res: DashboardsApi.RemoveOrgunitRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.removeAccessOrgunit(req.params.serial, req.params.orgunit, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async addUser(req: DashboardsApi.AddUserReq, res: DashboardsApi.AddUserRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.addAccessUser(req.params.serial, req.params.user, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeUser(req: DashboardsApi.RemoveUserReq, res: DashboardsApi.RemoveUserRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.removeAccessUser(req.params.serial, req.params.user, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async addGroup(req: DashboardsApi.AddGroupReq, res: DashboardsApi.AddGroupRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.addAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  async removeGroup(req: DashboardsApi.RemoveGroupReq, res: DashboardsApi.RemoveGroupRes, next: NextFunction) {
    try {
      res.json(await dashboardsModel.removeAccessGroup(req.params.serial, req.params.group, res.locals.issuer))
      
    } catch (error) {
      next(error);
    }
  },

  // Delete
  // -------------------------------------------------------------------------------
  async delete(req: DashboardsApi.DeleteReq, res: DashboardsApi.DeleteRes, next: NextFunction) {
    try {
      const dashboard = await dashboardsModel.getBySerial(req.params.serial, { banner: 1 });
      
      if (!dashboard) {
        res.json(true);
        return;
      }
  
      res.json(await dashboardsModel.delete(req.params.serial, res.locals.issuer));

      contentModel.delete(req.params.serial);

    } catch (error) {
      next(error);
    }
  }
}