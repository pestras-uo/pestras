/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";
import { ModifiersOperation, ValueModifier } from "../operations/modifiers";

export interface FillStageOptions {
  output: { field: string; value: any | null; method: "linear" | 'locf' | null; }[];
  sortBy: { field: string; order: 1 | -1 ; } | null;
  partitionBy: { field: string; modifiers: Array<ValueModifier>; } | null;
}

export class FillStage extends AggrPiplineStage<FillStageOptions> {

  constructor(options: FillStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.FILL, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState.filter(s => this.options.output.find(o => o.field === s.name))
  }

  compile() {
    const query: any = {};

    query.output = {};

    for (const opt of this.options.output)
      query.output[opt.field] = opt.value !== undefined
        ? { value: opt.value }
        : { method: opt.method };

    if (this.options.sortBy)
      query.sortBy = { [this.options.sortBy.field]: this.options.sortBy.order };

    if (this.options.partitionBy)
      query.partitionBy = new ModifiersOperation({
        value: '$' + this.options.partitionBy.field,
        modifiers: this.options.partitionBy.modifiers
      }).compile();

    return { $fill: query }
  }
}