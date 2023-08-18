/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";
import { Serial } from "@pestras/shared/util";
import { ModifiersOperation, ValueModifier } from "../operations/modifiers";
import { CustomStage } from "./custom";
import { SelectStage } from "./select";

export interface JoinStageOnOption {
  localField: { name: string; modifiers: ValueModifier[] };
  foreignField: { name: string; modifiers: ValueModifier[] };
}

export interface JoinStageOptions {
  dataStore: string;
  on: JoinStageOnOption[];
  fields: { name: string; as: string | null }[];
}

export class JoinStage extends AggrPiplineStage<JoinStageOptions> {

  constructor(options: JoinStageOptions, inputState: TypedEntity[] = [], readonly state: TypedEntity[] = []) {
    super(AggrStageTypes.JOIN, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    let dsState: TypedEntity[] = this.inputState;

    if (this.options.fields.length > 0)
      dsState = new SelectStage(this.options, this.state).outputType();

    return this.inputState.concat(dsState);
  }

  compile() {
    const asName = Serial.gen('TMP');
    const letRecord: Record<string, string> = {};
    const stages: any[] = [];

    for (const onEl of this.options.on)
      letRecord[onEl.localField.name] = `$${onEl.localField.name}`;

    const expr: any = { $expr: { $and: [] } };
    const and = expr.$expr.$and;

    for (const onEl of this.options.on)
      and.push({
        $eq: [
          new ModifiersOperation({ value: `$${onEl.foreignField.name}`, modifiers: onEl.foreignField.modifiers }).compile(),
          new ModifiersOperation({ value: `$$${onEl.localField.name}`, modifiers: onEl.localField.modifiers }).compile()
        ]
      });

    stages.push(new CustomStage({ $match: expr }).compile());

    if (this.options.fields.length > 0)
      stages.push(new SelectStage(this.options).compile());

    return [
      {
        $lookup: {
          from: this.options.dataStore,
          as: asName,
          let: letRecord,
          pipeline: stages
        }
      },
      {
        $unwind: `$${asName}`
      },
      {
        $replaceWith: {
          $mergeObjects: [`$${asName}`, '$$ROOT']
        }
      },
      {
        $unset: asName
      }
    ]
  }
}