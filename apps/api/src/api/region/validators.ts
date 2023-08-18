import { Validall } from "@pestras/validall";
import { Validators } from "../../validators";

export enum RegionsValidators {
  CREATE = 'createRegion',
  UPDATE = 'updateRegion',
  UPDATE_COORDS = 'updateRegionCoords'
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
  parent: { $type: 'string', $message: 'invalidParentSerial' }
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
})

