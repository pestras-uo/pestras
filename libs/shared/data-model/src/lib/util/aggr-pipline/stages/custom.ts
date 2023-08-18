/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export class CustomStage extends AggrPiplineStage<any> {

  constructor(pipeline: any, private customOutputType?: () => TypedEntity[]) {
    super(AggrStageTypes.CUSTOM, []);

    this.options = pipeline;
  }

  override outputType(): TypedEntity[] {
    return this.customOutputType ? this.customOutputType() : [];
  }

  compile() {
    return this.options;
  }
}