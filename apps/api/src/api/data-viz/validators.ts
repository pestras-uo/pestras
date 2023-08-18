import { Validall } from "@pestras/validall";
import { Validators } from "../../validators";

export enum DataVizValidator {
  CREATE = 'createDataViz',
  UPDATE = 'updateDataViz'
}

new Validall(DataVizValidator.CREATE, {
  $ref: Validators.DATA_VIZ
});

new Validall(DataVizValidator.UPDATE, {
  $ref: Validators.DATA_VIZ
});