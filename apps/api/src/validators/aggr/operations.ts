import { Validall } from "@pestras/validall";
import { Validators } from "..";
import { CastModifer, NumberModifier, StringModifier, ValueModifier } from "@pestras/shared/data-model";
import { dateUnits } from "../date";

export const convertTypes: CastModifer[] = ['double', 'int', 'boolean', 'string', 'date'];
export const numberModifiers: NumberModifier[] = ['round', 'floor', 'ceil', 'abs'];
export const stringModifiers: StringModifier[] = ['toUpper', 'toLower', 'trim'];

export const modifiersList = ([] as ValueModifier[]).concat(convertTypes, dateUnits, numberModifiers, stringModifiers);

new Validall(Validators.VALUE_MODIFIERS, {
  $is: 'notEmpty',
  $message: 'modifiersOperationModifiersAreRequired',
  $each: {
    $enum: modifiersList,
    $message: 'invalidModifiersOperationModifier'
  }
});

new Validall(Validators.CONVERT_OPERATION, {
  input: { $type: 'string', $message: 'invalidConvertOperationInput' },
  to: { $enum: ['double', 'long', 'int', 'decimel', 'bool', 'string', 'date'], $message: 'InvalidConvertOperationTo' },
  onError: { $message: 'convertOnErrorIsRequired' },
  onNull: { $message: 'convertOnNullIsRequired' }
});

new Validall(Validators.DATA_ADD_OPERATION, {
  field: { $type: 'string', $message: 'dateAddOperationFieldIsRequired' },
  amount: {
    $is: 'notEmpty', $message: 'dateAddAmountOperaionIsRequired',
    $each: {
      value: { $default: 0, $type: 'number', $message: 'invalidAddDateOperaionAmountValue' },
      unit: { $ref: Validators.DATE_UNIT }
    }
  }
});

new Validall(Validators.DATE_DIFF_OPERATION, {
  from: { $type: 'string', $message: 'dateDiffOperationFromIsRequired' },
  to: { $type: 'string', $message: 'dateDiffOperationToIsRequired' },
  unit: { $ref: Validators.DATE_UNIT }
});

new Validall(Validators.MATH_EXPR_OPERATION, {
  expr: { $type: 'string', $message: 'mathExprOperationIsRequired' },
  variables: {
    $is: 'notEmpty',
    $message: 'mathExprOperationVariablesAreRequired',
    $each: { $type: 'string', $message: 'invalidMathExprOperationVariable' }
  }
});

new Validall(Validators.MERGE_OBJECTS_OPERATION, {
  fields: {
    $is: 'notEmpty',
    $message: 'mergeObjectsOperationFieldsAreRequired',
    $each: { $type: 'string', $message: 'invalidMergeObjectsOperationField' }
  }
});

new Validall(Validators.MINMAX_OPERATION, {
  $and: [
    { value: { $type: 'string', $message: 'invalidMinmaxOperationValue' } },
    {
      $or: [
        { min: { $type: 'number', $message: 'invalidMinmaxOperationMinValue' } },
        { max: { $type: 'number', $message: 'invalidMinmaxOperationMaxValue' } }
      ]
    }
  ]
});

new Validall(Validators.MODIFIERS_OPERATION, {
  value: { $type: 'string', $message: 'invalidModifiersOperationValue' },
  modifiers: { $ref: Validators.VALUE_MODIFIERS }
});

new Validall(Validators.ROUND_OPERATION, {
  value: { $type: 'string', $message: 'invalidRoundOperationValue' },
  place: { $type: 'number', $default: 0, $message: 'invalidRoundOperationPlaceValue' }
});