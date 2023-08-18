import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface LimitStageOptions {
  limit: number;
}

export class LimitStage extends AggrPiplineStage<LimitStageOptions> {

  constructor(options: LimitStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.LIMIT, inputState);

    this.options = options;
  }

  compile() {
    return { $limit: this.options.limit };
  }
}