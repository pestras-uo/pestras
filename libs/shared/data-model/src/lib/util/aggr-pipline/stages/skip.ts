import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface SkipStageOptions {
  skip: number;
}

export class SkipStage extends AggrPiplineStage<SkipStageOptions> {

  constructor(options: SkipStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SKIP, inputState);

    this.options = options;
  }

  compile() {
    return { $skip: this.options.skip };
  }
}