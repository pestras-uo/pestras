/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";
import { AggrOperation } from "../operations";
import { ConvertOperation, ConvertOperationOptions } from "../operations/convert";
import { DateDiffOperation, DateDiffOperationOptions } from "../operations/date-diff";
import { DateAddOperation, DateAddOperationOptions } from "../operations/date_add";
import { MathExprOperation, MathExprOperationOptions } from "../operations/math-expr";
import { MinmaxOperation, MinmaxOperationOptions } from "../operations/minmax";
import { ModifiersOperation, ModifiersOperationOptions } from "../operations/modifiers";
import { RoundOperation, RoundOperationOptions } from "../operations/round";

export type SetStageOption = { field: string; display_name: string; }
  & (
    { operation: 'convert', options: ConvertOperationOptions }
    | { operation: 'dateAdd', options: DateAddOperationOptions }
    | { operation: 'dateDiff', options: DateDiffOperationOptions }
    | { operation: 'mathExpr', options: MathExprOperationOptions }
    | { operation: 'minmax', options: MinmaxOperationOptions }
    | { operation: 'modifiers', options: ModifiersOperationOptions }
    | { operation: 'round', options: RoundOperationOptions }
  );

export interface SetStageOptions {
  fields: SetStageOption[];
}

export class SetStage extends AggrPiplineStage<SetStageOptions> {

  constructor(options: SetStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SELECT, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState.concat(this.options.fields.map(o => {
      return createTypedEntity({
        ...output[o.operation](o.options, this.inputState),
        name: o.field,
        display_name: o.display_name
      })
    }));
  }

  compile() {
    const $set: any = {};

    for (const o of this.options.fields) {
      $set[o.field] = getOperation[o.operation](o.options).compile()
    }

    return { $set }
  }
}

const output: Record<SetStageOption['operation'], (options: any, previousState: TypedEntity[]) => TypedEntity> = {
  convert: (o: any) => ConvertOperation.OutputType(o),
  dateAdd: (_: any) => DateAddOperation.OutputType(),
  dateDiff: (o: any) => DateDiffOperation.OutputType(o),
  mathExpr: (o: any) => MathExprOperation.OutputType(o),
  minmax: (_: any) => MinmaxOperation.OutputType(),
  modifiers: (o: any) => ModifiersOperation.OutputType(o),
  round: (o: any) => RoundOperation.OutputType(o)
}

const getOperation: Record<SetStageOption['operation'], (o: any) => AggrOperation> = {
  convert: (o: any) => new ConvertOperation(o),
  dateAdd: (o: any) => new DateAddOperation(o),
  dateDiff: (o: any) => new DateDiffOperation(o),
  mathExpr: (o: any) => new MathExprOperation(o),
  minmax: (o: any) => new MinmaxOperation(o),
  modifiers: (o: any) => new ModifiersOperation(o),
  round: (o: any) => new RoundOperation(o)
}