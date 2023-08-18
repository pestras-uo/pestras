import { clientApiModel } from "../../models"
import { ClientsApi } from "./types"

export const controller = {

  async getByBlueprint(req: ClientsApi.GetByBlueprintReq, res: ClientsApi.GetByBlueprintRes) {
    res.json(await clientApiModel.getByBlueprint(req.params.blueprint));
  },

  async getBySerial(req: ClientsApi.GetBySerialReq, res: ClientsApi.GetBySerialRes) {
    res.json(await clientApiModel.getBySerial(req.params.serial));
  },

  async create(req: ClientsApi.CreateReq, res: ClientsApi.CreateRes) {
    res.json(await clientApiModel.create(req.body, res.locals.issuer));
  },

  async update(req: ClientsApi.UpdateReq, res: ClientsApi.UpdateRes) {
    res.json(await clientApiModel.update(req.params.serial, req.body.client_name, res.locals.issuer));
  },

  async addIP(req: ClientsApi.AddIPReq, res: ClientsApi.AddIPRes) {
    res.json(await clientApiModel.addIP(req.params.serial, req.body.ip, res.locals.issuer));
  },

  async removeIP(req: ClientsApi.RemoveIPReq, res: ClientsApi.RemoveIPRes) {
    res.json(await clientApiModel.removeIP(req.params.serial, req.body.ip, res.locals.issuer));
  },

  async addDataStore(req: ClientsApi.AddDataStoreReq, res: ClientsApi.AddDataStoreRes) {
    res.json(await clientApiModel.addDataStore(req.params.serial, req.params.ds, req.body, res.locals.issuer));
  },

  async updateDataStore(req: ClientsApi.UpdateDataStoreReq, res: ClientsApi.UpdateDataStoreRes) {
    res.json(await clientApiModel.updateDataStore(req.params.serial, req.params.ds, req.body, res.locals.issuer));
  },

  async removeDataStore(req: ClientsApi.RemoveDataStoreReq, res: ClientsApi.RemoveDataStoreRes) {
    res.json(await clientApiModel.removeDataStore(req.params.serial, req.params.ds, res.locals.issuer));
  },

  async addParam(req: ClientsApi.AddParamReq, res: ClientsApi.AddParamRes) {
    res.json(await clientApiModel.addParam(req.params.serial, req.params.ds, req.body, res.locals.issuer));
  },

  async updateParam(req: ClientsApi.UpdateParamReq, res: ClientsApi.UpdateParamRes) {
    res.json(await clientApiModel.updateParam(req.params.serial, req.params.ds, req.params.param, req.body, res.locals.issuer));
  },

  async removeParam(req: ClientsApi.RemoveParamReq, res: ClientsApi.RemoveParamRes) {
    res.json(await clientApiModel.removeParam(req.params.serial, req.params.ds, req.params.param, res.locals.issuer));
  },

  async delete(req: ClientsApi.DeleteReq, res: ClientsApi.DeleteRes) {
    res.json(await clientApiModel.delete(req.params.serial, res.locals.issuer));
  }
}