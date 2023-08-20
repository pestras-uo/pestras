import { contentModel, dataStoresModel } from "../../models";
import { DataStoreApi } from "./types";
import { NextFunction } from 'express';

export const controller = {

  // read
  // ---------------------------------------------------------------------------------------
  async getByBlueprint(req: DataStoreApi.GetByBlueprintReq, res: DataStoreApi.GetByBlueprintRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.getByBlueprint(req.params.bp));
      
    } catch (error) {
      next(error);
    }
  },

  async getBySerial(req: DataStoreApi.GetBySerialReq, res: DataStoreApi.GetBySerialRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.getBySerial(req.params.serial));
      
    } catch (error) {
      next(error);
    }
  },

  // create
  // ---------------------------------------------------------------------------------------
  async create(req: DataStoreApi.CreateReq, res: DataStoreApi.CreateRes, next: NextFunction) {
    try {
      const ds = await dataStoresModel.create(req.body, res.locals.issuer)
      
      await contentModel.create(ds.serial);
  
      res.json(ds);

    } catch (error) {
      next(error);
    }
  },

  // update
  // --------------------------------------------------------------------------------------
  async update(req: DataStoreApi.UpdateReq, res: DataStoreApi.UpdateRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.update(req.params.serial, req.body.name, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateState(req: DataStoreApi.UpdateStateReq, res: DataStoreApi.UpdateStateRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.updateState(req.params.serial, req.body.state, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async build(req: DataStoreApi.BuildReq, res: DataStoreApi.BuildRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.build(req.params.serial, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // table
  // --------------------------------------------------------------------------------------
  async setTableSettings(req: DataStoreApi.SetTableSettingsReq, res: DataStoreApi.SetTableSettingsRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setTableSettings(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // web service
  // --------------------------------------------------------------------------------------
  async setWebService(req: DataStoreApi.SetWebServiceReq, res: DataStoreApi.SetWebServiceRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setWebServiceConfig(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async setWebServiceAuth(req: DataStoreApi.SetWebServiceAuthReq, res: DataStoreApi.SetWebServiceAuthRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setWebServiceAuth(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeWebServiceAuth(req: DataStoreApi.RemoveWebServiceAuthReq, res: DataStoreApi.RemoveWebServiceAuthRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setWebServiceAuth(req.params.serial, null, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async setWebServiceHeader(req: DataStoreApi.SetWebServiceHeaderReq, res: DataStoreApi.SetWebServiceHeaderRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setHeader(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeWebServiceHeader(req: DataStoreApi.RemoveWebServiceHeaderReq, res: DataStoreApi.RemoveWebServiceHeaderRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setHeader(req.params.serial, { key: req.params.key }, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async addWebServiceQuery(req: DataStoreApi.AddWebServiceQueryReq, res: DataStoreApi.AddWebServiceQueryRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.addQueryOption(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeWebServiceQuery(req: DataStoreApi.RemoveWebServiceQueryReq, res: DataStoreApi.RemoveWebServiceQueryRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.removeQueryOption(req.params.serial, req.params.option, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async addWebServiceSelection(req: DataStoreApi.AddWebServiceSelectionReq, res: DataStoreApi.AddWebServiceSelectionRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.addSelection(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeWebServiceSelection(req: DataStoreApi.RemoveWebServiceSelectionReq, res: DataStoreApi.RemoveWebServiceSelectionRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.removeSelection(req.params.serial, req.params.field, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // aggregation
  // --------------------------------------------------------------------------------------
  async setAggregation(req: DataStoreApi.SetAggregationReq, res: DataStoreApi.SetAggregationRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setAggregation(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // fields
  // --------------------------------------------------------------------------------------
  async addField(req: DataStoreApi.AddFieldReq, res: DataStoreApi.AddFieldRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.addField(req.params.serial, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateField(req: DataStoreApi.UpdateFieldReq, res: DataStoreApi.UpdateFieldRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.updateField(req.params.serial, req.params.field, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async updateFieldConfig(req: DataStoreApi.UpdateFieldConfigReq, res: DataStoreApi.UpdateFieldConfigRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.updateFieldConfig(req.params.serial, req.params.field, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async setFieldConstraint(req: DataStoreApi.SetFieldConstraintReq, res: DataStoreApi.SetFieldConstraintRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setFieldConstraint(req.params.serial, req.params.field, req.body, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeFieldConstraint(req: DataStoreApi.RemopveFieldConstraintReq, res: DataStoreApi.RemopveFieldConstraintRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setFieldConstraint(req.params.serial, req.params.field, null, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeField(req: DataStoreApi.RemopveFieldReq, res: DataStoreApi.RemopveFieldRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.removeField(req.params.serial, req.params.field, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // update activation
  // --------------------------------------------------------------------------------------
  async setActivation(req: DataStoreApi.SetActivationReq, res: DataStoreApi.SetActivationRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.setActivation(req.params.serial, !!req.params.is_active, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  // update collaborators
  // --------------------------------------------------------------------------------------
  async addCollaborator(req: DataStoreApi.AddCollaboratorReq, res: DataStoreApi.AddCollaboratorRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.addCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  },

  async removeCollaborator(req: DataStoreApi.RemoveCollaboratorReq, res: DataStoreApi.RemoveCollaboratorRes, next: NextFunction) {
    try {
      res.json(await dataStoresModel.removeCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
      
    } catch (error) {
      next(error);
    }
  }
}