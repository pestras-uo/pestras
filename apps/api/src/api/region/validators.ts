import { Validall } from "@pestras/validall";
import { Validators } from "../../validators";
import { Serial } from "@pestras/shared/util";

export enum RegionsValidators {
  CREATE = 'createRegion',
  UPDATE = 'updateRegion',
  UPDATE_COORDS = 'updateRegionCoords',
  ADD_GIS_MAP = 'addRegionGisMap',
  UPDATE_GIS_MAP = 'updateRegionGisMap',
  UPDATE_GIS_MAP_API_KEY = 'updateRegionGisMapApiKey',
  ADD_GIS_MAP_LAYER = 'addRegionGisMapLayer',
  UPDATE_GIS_MAP_LAYER = 'updateRegionGisMapLayer',
}

const COORDS = 'coordsSchema';

new Validall(COORDS, {
  $default: [],
  $each: { $ref: Validators.GEOLOCATION }
});

new Validall(RegionsValidators.CREATE, {
  name: { $ref: Validators.NAME },
  type: { $type: 'string', $message: 'invalidRegionType' },
  location: { $ref: Validators.GEOLOCATION, $message: 'locationIsRequired', },
  zoom: { $type: 'number' },
  parent: {
    $nullable: true,
    $fn: (v) => {
      if (!Serial.isValid(v, true))
        throw "invalidParentSerial"
    }
  }
});

new Validall(RegionsValidators.UPDATE, {
  name: { $ref: Validators.NAME },
  type: { $type: 'string', $message: 'invalidRegionType' },
  zoom: { $type: 'number' },
  location: { $ref: Validators.GEOLOCATION, $message: 'regionLocationIsRequired' }
});

new Validall(RegionsValidators.UPDATE_COORDS, {
  type: { $equals: 'MultiPolygon' },
  coordinates: {
    $is: 'notEmpty',
    $message: 'coordinatesAreRequired',
    $each: {
      $is: 'notEmpty',
      $message: 'coordinatesAreRequired',
      $each: {
        $each: {
          lat: { $type: 'number', $required: true },
          lng: { $type: 'number', $required: true }
        }
      }
    }
  }
});

new Validall(RegionsValidators.ADD_GIS_MAP, {
  name: { $type: 'string' },
  apiKey: { $nullable: true, $type: 'string' },
  portal: { $nullable: true, $type: 'string' },
  id: { $nullable: true, $type: 'string' },
  basemap: { $type: 'string' }
});

new Validall(RegionsValidators.UPDATE_GIS_MAP, {
  name: { $type: 'string' },
  portal: { $nullable: true, $type: 'string' },
  id: { $nullable: true, $type: 'string' },
  basemap: { $type: 'string' }
});

new Validall(RegionsValidators.UPDATE_GIS_MAP_API_KEY, {
  apiKey: { $type: 'string' }
});

new Validall(RegionsValidators.ADD_GIS_MAP_LAYER, {
  $props: {
    name: { $type: 'string' },
  },
  $or: [
    { id: { $type: 'string' } },
    { url: { $type: 'string' } }
  ]
});

new Validall(RegionsValidators.UPDATE_GIS_MAP_LAYER, {
  $ref: RegionsValidators.ADD_GIS_MAP_LAYER
});

