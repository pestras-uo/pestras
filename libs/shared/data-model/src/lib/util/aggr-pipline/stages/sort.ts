/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface SortStageOptions {
  fields: { field: string; order: 1 | -1 }[];
}

export class SortStage extends AggrPiplineStage<SortStageOptions> {

  constructor(options: SortStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SORT, inputState);

    this.options = options;
  }

  compile() {
    const aggr: any = {};

    for (const f of this.options.fields)
      aggr[f.field] = f.order;

    return { $sort: aggr };
  }
}