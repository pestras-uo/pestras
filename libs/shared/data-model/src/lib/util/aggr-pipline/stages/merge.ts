import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface MergeStageOptions {
  into: string | { db: string; col: string; },
  on: string | string[],
  whenMatched: 'replace'| 'keepExisting' | 'merge' | 'fail',
  whenNotMatched: 'insert' | 'discard' | 'fail'
}

export class MergeStage extends AggrPiplineStage<string | MergeStageOptions> {

  constructor(options: string | MergeStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.MERGE, inputState);

    this.options = options;
  }

  compile() {
    return {
      $merge: this.options
    };
  }
}