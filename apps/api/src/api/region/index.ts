import { RegionsApi, Role } from "@pestras/shared/data-model";
import { Router } from "express";
import { apiAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { controller } from "./controller";
import { RegionsValidators } from "./validators";

export const regionsRoutes = Router()
// read
// -----------------------------------------------------------------------------
[RegionsApi.GetAll.REQ_METHOD](
  RegionsApi.GetAll.REQ_PATH,
  apiAuth(),
  controller.getAll
)
[RegionsApi.GetBySerial.REQ_METHOD](
  RegionsApi.GetBySerial.REQ_PATH,
  apiAuth(),
  controller.get
)
// create, update
// -----------------------------------------------------------------------------
[RegionsApi.Create.REQ_METHOD](
  RegionsApi.Create.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.CREATE),
  controller.create
)
[RegionsApi.Update.REQ_METHOD](
  RegionsApi.Update.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.UPDATE),
  controller.update
)
// boundry coords
// -----------------------------------------------------------------------------
[RegionsApi.UpdateCoords.REQ_METHOD](
  RegionsApi.UpdateCoords.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.UPDATE_COORDS),
  controller.updateCoords
)
// gis maps
// -----------------------------------------------------------------------------
[RegionsApi.AddGisMap.REQ_METHOD](
  RegionsApi.AddGisMap.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.ADD_GIS_MAP),
  controller.addGisMap
)
[RegionsApi.UpdateGisMap.REQ_METHOD](
  RegionsApi.UpdateGisMap.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.UPDATE_GIS_MAP),
  controller.updateGisMap
)
[RegionsApi.UpdateGisMapApiKey.REQ_METHOD](
  RegionsApi.UpdateGisMapApiKey.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.UPDATE_GIS_MAP_API_KEY),
  controller.updateGisMapApiKey
)
[RegionsApi.RemoveGisMap.REQ_METHOD](
  RegionsApi.RemoveGisMap.REQ_PATH,
  apiAuth([Role.ADMIN]),
  controller.removeGisMap
)
// gis maps layers
// -----------------------------------------------------------------------------
[RegionsApi.AddGisMapLayer.REQ_METHOD](
  RegionsApi.AddGisMapLayer.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.ADD_GIS_MAP_LAYER),
  controller.addGisMapLayer
)
[RegionsApi.UpdateGisMapLayer.REQ_METHOD](
  RegionsApi.UpdateGisMapLayer.REQ_PATH,
  apiAuth([Role.ADMIN]),
  validate(RegionsValidators.UPDATE_GIS_MAP_LAYER),
  controller.updateGisMapLayer
)
[RegionsApi.RemoveGisMapLayer.REQ_METHOD](
  RegionsApi.RemoveGisMapLayer.REQ_PATH,
  apiAuth([Role.ADMIN]),
  controller.removeGisMapLayer
)