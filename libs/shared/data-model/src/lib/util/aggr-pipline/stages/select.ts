/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export type SelectStageOptions = {
  fields: { name: string; as?: string | null }[];
};

export class SelectStage extends AggrPiplineStage<SelectStageOptions> {

  constructor(options: SelectStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.SELECT, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.options.fields.map(opt => {
      const field = this.inputState.find(f => f.name === opt.name);
      return field ? createTypedEntity({ name: opt.as || opt.name, display_name: field.display_name, type: field.type }) : null
    }).filter(Boolean) as TypedEntity[];
  }

  compile() {
    const $project: Record<string, any> = {};

    for (const field of this.options.fields)
      $project[field.as || field.name] = field.as ? `$${field.name}` : 1;

    return { $project }
  }
}