import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface UnsetStageOptions {
  fields: string[];
}

export class UnsetStage extends AggrPiplineStage<UnsetStageOptions> {

  constructor(options: UnsetStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.UNSET, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState.filter(f => !this.options.fields.includes(f.name));
  }

  compile() {
    return {
      $unset: this.options.fields
    }
  }
}