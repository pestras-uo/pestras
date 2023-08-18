/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrStageTypes, AggrPiplineStage } from ".";
import { TypedEntity, TypesNames, createTypedEntity } from "../../data-types";
import { ModifiersOperation, ValueModifier } from "../operations/modifiers";

export type WindowStageCumulateMethod = 'sum' | 'min' | 'max' | 'count' | 'avg';

export interface SetWindowFieldsStageOptions {
  sortBy: { field: string; order: 1 | -1 }[];
  partitionBy: { field: string; modifiers: ValueModifier[] } | null;
  outputs: {
    name: string;
    display_name: string;
    field: { name: string; modifiers: ValueModifier[] };
    method: WindowStageCumulateMethod;
    documents: { start: number | 'unbounded' | 'current', end: number | 'unbounded' | 'current' } | null;
  }[];
}

export class SetWindowFieldsStage extends AggrPiplineStage<SetWindowFieldsStageOptions> {

  constructor(options: SetWindowFieldsStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SET_WINDOW_FIELDS, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState.concat(this.options.outputs.map(o => {
      const depType = this.inputState.find(t => t.name === o.field.name)?.type;

      let outType: TypesNames = 'double';

      if (o.method === 'count')
        outType = 'int';
      else if (o.method === 'sum')
        outType = depType === 'double' ? 'double' : 'int'
      else if (o.method === 'avg')
        outType = 'double';


      return createTypedEntity({
        name: o.name,
        display_name: o.display_name,
        type: outType
      })
    }));
  }

  compile() {
    const $setWindowFields: any = {};

    if (this.options.partitionBy)
      $setWindowFields.partitionBy = new ModifiersOperation({
        value: '$' + this.options.partitionBy.field,
        modifiers: this.options.partitionBy.modifiers
      }).compile();

    $setWindowFields.sortBy = this.options.sortBy.reduce((rec, curr) => {
      rec[curr.field] = curr.order;
      return rec;
    }, {} as Record<string, -1 | 1>);

    $setWindowFields.output = {};

    for (const output of this.options.outputs) {
      $setWindowFields.output[output.name] = {
        [`$${output.method}`]: new ModifiersOperation({
          value: '$' + output.field.name,
          modifiers: output.field.modifiers
        }),
        window: {
          documents: output.documents
            ? [output.documents.start, output.documents.end]
            : ['unbounded', 'current']
        }
      };
    }

    return { $setWindowFields };
  }
}