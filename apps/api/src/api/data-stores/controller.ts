import { contentModel, dataStoresModel } from "../../models";
import { DataStoreApi } from "./types";

export const controller = {

  // read
  // ---------------------------------------------------------------------------------------
  async getByBlueprint(req: DataStoreApi.GetByBlueprintReq, res: DataStoreApi.GetByBlueprintRes) {
    res.json(await dataStoresModel.getByBlueprint(req.params.bp));
  },

  async getBySerial(req: DataStoreApi.GetBySerialReq, res: DataStoreApi.GetBySerialRes) {
    res.json(await dataStoresModel.getBySerial(req.params.serial));
  },

  // create
  // ---------------------------------------------------------------------------------------
  async create(req: DataStoreApi.CreateReq, res: DataStoreApi.CreateRes) {
    const ds = await dataStoresModel.create(req.body, res.locals.issuer)

    await contentModel.create(ds.serial);

    res.json(ds);
  },

  // update
  // --------------------------------------------------------------------------------------
  async update(req: DataStoreApi.UpdateReq, res: DataStoreApi.UpdateRes) {
    res.json(await dataStoresModel.update(req.params.serial, req.body.title, res.locals.issuer));
  },

  async updateState(req: DataStoreApi.UpdateStateReq, res: DataStoreApi.UpdateStateRes) {
    res.json(await dataStoresModel.updateState(req.params.serial, req.body.state, res.locals.issuer));
  },

  async build(req: DataStoreApi.BuildReq, res: DataStoreApi.BuildRes) {
    res.json(await dataStoresModel.build(req.params.serial, res.locals.issuer));
  },

  // table
  // --------------------------------------------------------------------------------------
  async setTableSettings(req: DataStoreApi.SetTableSettingsReq, res: DataStoreApi.SetTableSettingsRes) {
    res.json(await dataStoresModel.setTableSettings(req.params.serial, req.body, res.locals.issuer));
  },

  // web service
  // --------------------------------------------------------------------------------------
  async setWebService(req: DataStoreApi.SetWebServiceReq, res: DataStoreApi.SetWebServiceRes) {
    res.json(await dataStoresModel.setWebServiceConfig(req.params.serial, req.body, res.locals.issuer));
  },

  async setWebServiceAuth(req: DataStoreApi.SetWebServiceAuthReq, res: DataStoreApi.SetWebServiceAuthRes) {
    res.json(await dataStoresModel.setWebServiceAuth(req.params.serial, req.body, res.locals.issuer));
  },

  async removeWebServiceAuth(req: DataStoreApi.RemoveWebServiceAuthReq, res: DataStoreApi.RemoveWebServiceAuthRes) {
    res.json(await dataStoresModel.setWebServiceAuth(req.params.serial, null, res.locals.issuer));
  },

  async setWebServiceHeader(req: DataStoreApi.SetWebServiceHeaderReq, res: DataStoreApi.SetWebServiceHeaderRes) {
    res.json(await dataStoresModel.setHeader(req.params.serial, req.body, res.locals.issuer));
  },

  async removeWebServiceHeader(req: DataStoreApi.RemoveWebServiceHeaderReq, res: DataStoreApi.RemoveWebServiceHeaderRes) {
    res.json(await dataStoresModel.setHeader(req.params.serial, { key: req.params.key }, res.locals.issuer));
  },

  async addWebServiceQuery(req: DataStoreApi.AddWebServiceQueryReq, res: DataStoreApi.AddWebServiceQueryRes) {
    res.json(await dataStoresModel.addQueryOption(req.params.serial, req.body, res.locals.issuer));
  },

  async removeWebServiceQuery(req: DataStoreApi.RemoveWebServiceQueryReq, res: DataStoreApi.RemoveWebServiceQueryRes) {
    res.json(await dataStoresModel.removeQueryOption(req.params.serial, req.params.option, res.locals.issuer));
  },

  async addWebServiceSelection(req: DataStoreApi.AddWebServiceSelectionReq, res: DataStoreApi.AddWebServiceSelectionRes) {
    res.json(await dataStoresModel.addSelection(req.params.serial, req.body, res.locals.issuer));
  },

  async removeWebServiceSelection(req: DataStoreApi.RemoveWebServiceSelectionReq, res: DataStoreApi.RemoveWebServiceSelectionRes) {
    res.json(await dataStoresModel.removeSelection(req.params.serial, req.params.field, res.locals.issuer));
  },

  // aggregation
  // --------------------------------------------------------------------------------------
  async setAggregation(req: DataStoreApi.SetAggregationReq, res: DataStoreApi.SetAggregationRes) {
    res.json(await dataStoresModel.setAggregation(req.params.serial, req.body, res.locals.issuer));
  },

  // fields
  // --------------------------------------------------------------------------------------
  async addField(req: DataStoreApi.AddFieldReq, res: DataStoreApi.AddFieldRes) {
    res.json(await dataStoresModel.addField(req.params.serial, req.body, res.locals.issuer));
  },

  async updateField(req: DataStoreApi.UpdateFieldReq, res: DataStoreApi.UpdateFieldRes) {
    res.json(await dataStoresModel.updateField(req.params.serial, req.params.field, req.body, res.locals.issuer));
  },

  async updateFieldConfig(req: DataStoreApi.UpdateFieldConfigReq, res: DataStoreApi.UpdateFieldConfigRes) {
    res.json(await dataStoresModel.updateFieldConfig(req.params.serial, req.params.field, req.body, res.locals.issuer));
  },

  async setFieldConstraint(req: DataStoreApi.SetFieldConstraintReq, res: DataStoreApi.SetFieldConstraintRes) {
    res.json(await dataStoresModel.setFieldConstraint(req.params.serial, req.params.field, req.body, res.locals.issuer));
  },

  async removeFieldConstraint(req: DataStoreApi.RemopveFieldConstraintReq, res: DataStoreApi.RemopveFieldConstraintRes) {
    res.json(await dataStoresModel.setFieldConstraint(req.params.serial, req.params.field, null, res.locals.issuer));
  },

  async removeField(req: DataStoreApi.RemopveFieldReq, res: DataStoreApi.RemopveFieldRes) {
    res.json(await dataStoresModel.removeField(req.params.serial, req.params.field, res.locals.issuer));
  },

  // update activation
  // --------------------------------------------------------------------------------------
  async setActivation(req: DataStoreApi.SetActivationReq, res: DataStoreApi.SetActivationRes) {
    res.json(await dataStoresModel.setActivation(req.params.serial, !!req.params.is_active, res.locals.issuer));
  },

  // update collaborators
  // --------------------------------------------------------------------------------------
  async addCollaborator(req: DataStoreApi.AddCollaboratorReq, res: DataStoreApi.AddCollaboratorRes) {
    res.json(await dataStoresModel.addCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
  },

  async removeCollaborator(req: DataStoreApi.RemoveCollaboratorReq, res: DataStoreApi.RemoveCollaboratorRes) {
    res.json(await dataStoresModel.removeCollaborator(req.params.serial, req.params.collaborator, res.locals.issuer));
  }
}