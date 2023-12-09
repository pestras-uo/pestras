/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";
import { ModifiersOperation, ValueModifier } from "../operations/modifiers";

export const cumulateMethod = ['sum', 'min', 'max', 'count', 'avg'] as const;
export type CumulateMethod = typeof cumulateMethod[number];

export interface BucketStageOptions {
  groupBy: { field: string; modifiers: ValueModifier[]; };
  buckets: number;
  // exp: // name of field or math formula
  cumulate: { field: string; method: CumulateMethod; expr: string | number; }[];
}

export class BucketStage extends AggrPiplineStage<BucketStageOptions> {

  constructor(options: any, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.BUCKET, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    const fields: TypedEntity[] = [
      createTypedEntity({ name: 'min', display_name: 'min', type: 'double' }),
      createTypedEntity({ name: 'max', display_name: 'max', type: 'double' })
    ];

    if (this.options.cumulate?.length) {
      for (const opt of this.options.cumulate.filter(c => !!c.field)) {
        const field = this.inputState.find(f => f.name === opt.field);
        fields.push(createTypedEntity({ name: opt.field, display_name: field?.display_name ?? opt.field, type: 'double' }));
      }
    } else {
      fields.push(createTypedEntity({ name: 'count', display_name: 'count', type: 'int' }));
    }

    return fields;
  }

  compile() {
    const aggr: any = {
      groupBy: new ModifiersOperation({
        value: '$' + this.options.groupBy.field,
        modifiers: this.options.groupBy.modifiers
      }),
      buckets: this.options.buckets
    };

    const project: any = {
      _id: 0,
      min: '$_id.min',
      max: '$_id.max',
    };

    if (this.options.cumulate?.length) {
      const output: any = {};

      for (const opt of this.options.cumulate) {
        output[opt.field] = { ['$' + opt.method]: opt.expr }
        project[opt.field] = 1;
      }

      aggr.output = output;

    } else {
      project.count = 1;
    }

    return [{
      $bucketAuto: {
        groupBy: aggr
      }
    }, {
      $project: project
    }]
  }
}