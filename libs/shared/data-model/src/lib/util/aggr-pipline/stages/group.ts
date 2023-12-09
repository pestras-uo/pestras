/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";
import { ValueModifier } from "../operations/modifiers";
import { ModifiersOperation } from "../operations/modifiers";

export const groupStageCumulateMethod = ['sum', 'min', 'max', 'count', 'avg', 'median', 'first', 'last'] as const;
export type GroupStageCumulateMethod = typeof groupStageCumulateMethod[number];

export interface GroupStageOptions {
  by: { field: string; as: string | null; modifiers: ValueModifier[]; } | null;
  // expr: // name of field or math formula
  cumulate: { field: string; display_name: string; method: GroupStageCumulateMethod; expr: string | number; }[];
}

export class GroupStage extends AggrPiplineStage<GroupStageOptions> {

  constructor(options: GroupStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.GROUP, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    const fields: TypedEntity[] = [];

    if (this.options.by) {
      const field = this.inputState.find(f => f.name === this.options.by?.field);
      fields.push(createTypedEntity({
        ...ModifiersOperation.OutputType(this.options.by.modifiers),
        name: this.options.by.as || this.options.by.field,
        display_name: field?.display_name ?? this.options.by.as ?? this.options.by.field
      }));
    }

    if (this.options.cumulate?.length)
      for (const el of this.options.cumulate)
        fields.push(createTypedEntity({ name: el.field, display_name: el.display_name, type: 'double' }));

    return fields;
  }

  compile() {
    const group: any = {};
    const project: any = { _id: 0 };

    if (!this.options.by)
      group._id = null;
    else if (typeof this.options.by === 'string') {
      group._id = '$' + this.options.by;
      project[this.options.by] = '$_id.' + this.options.by;

    } else if (Array.isArray(this.options.by)) {
      group._id = {};
      for (const el of this.options.by) {
        group._id[el.as] = new ModifiersOperation({ value: '$' + el.field, modifiers: el.modifiers }).compile();
        project[el.as] = '$_id.' + el.as;
      }

    } else {
      const name = this.options.by.as || this.options.by.field;
      group._id = {
        [name]: new ModifiersOperation({ value: '$' + this.options.by.field, modifiers: this.options.by.modifiers }).compile()
      };
      project[name] = '$_id.' + name;
    }

    if (this.options.cumulate?.length) {
      for (const el of this.options.cumulate) {
        group[el.field] = { ['$' + el.method]: typeof el.expr === 'string' ? '$' + el.expr : el.expr };
        project[el.field] = 1;
      }
    }

    return [{
      $group: group
    }, {
      $project: project
    }];
  }
}