import { Validall } from "@pestras/validall";
import { Validators } from ".";
import { modifiersList } from "./aggr/operations";

// Commion schemas
// --------------------------------------------------------------------------------------
new Validall(Validators.VALUE_MODIFIERS, {
  $nullable: true,
  $each: {
    $type: 'string',
    $enum: modifiersList,
    $message: 'invalidModifierOperator'
  }
});

new Validall(Validators.CONSTRAINT_OPTIONS, {
  modifiers: { $ref: Validators.VALUE_MODIFIERS },
  values: { $type: 'array', $message: 'compareToValueIsRequired' },
  reverse: { $type: 'boolean' }
});