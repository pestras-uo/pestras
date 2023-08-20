import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface OutStageOptions { 
  db: string | null; 
  coll: string; 
};

export class OutStage extends AggrPiplineStage<OutStageOptions> {

  constructor(options: OutStageOptions, inputState: TypedEntity[]) {
    super(AggrStageTypes.OUT, inputState);

    this.options = options;
  }

  compile() {
    return {
      $out: this.options.db ?  this.options : this.options.coll
    };
  }
}