import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface SampleStageOptions {
  size: number;
}

export class SampleStage extends AggrPiplineStage<SampleStageOptions> {

  constructor(options: SampleStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SAMPLE, inputState);

    this.options = options;
  }

  compile() {
    return {
      $sample: this.options.size
    };
  }
}