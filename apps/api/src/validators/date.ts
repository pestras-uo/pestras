import { Validall } from "@pestras/validall";
import { Validators } from ".";
import { DateUnit } from "@pestras/shared/data-model";

export const dateUnits: DateUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];

new Validall(Validators.DATE_UNIT, {
  $in: dateUnits, $message: 'invalidDateUnit'
});

new Validall(Validators.DURATION, {
  $default: [],
  $each: {
    unit: { $ref: Validators.DATE_UNIT },
    amount: { $type: 'number', $default: 0 }
  }
});