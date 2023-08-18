import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export interface UnwindStageOptions {
  field: string;
}

export class UnwindStage extends AggrPiplineStage<UnwindStageOptions> {

  constructor(options: UnwindStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.UNWIND, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState.map(f => {
      return (f.name === this.options.field)
        ? createTypedEntity({ name: f.name, display_name: f.display_name, type: f.type })
        : f;
    });
  }

  compile() {
    return {
      $unwind: '$' + this.options.field
    };
  }
}