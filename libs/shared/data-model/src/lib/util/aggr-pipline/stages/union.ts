/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";

export interface UnionStageOptions {
  dataStore: string;
  mapFields: { src: string; dest: string; }[]
}

export class UnionStage extends AggrPiplineStage<UnionStageOptions> {

  constructor(options: UnionStageOptions, inputState: TypedEntity[], readonly state: TypedEntity[] = []) {
    super(AggrStageTypes.UNION, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState;
  }

  compile() {
    const project: any = {};

    for (const mapField of this.options.mapFields)
      project[mapField.dest] = '$' + mapField.src;

    return {
      $unionWith: {
        coll: this.options.dataStore,
        pipeline: [{ $project: project }]
      }
    };
  }
}