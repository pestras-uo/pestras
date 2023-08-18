/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";
import { DateUnit } from "./modifiers";

export interface DateDiffOperationOptions {
  unit: DateUnit,
  // could be "$$NOW" 
  from: any;
  // could be "$$NOW" 
  to: any;
  unit_name: string | null;
}

export class DateDiffOperation extends AggrOperation<DateDiffOperationOptions> {

  constructor(options: DateDiffOperationOptions) {
    super(AggrOperationType.DATE_DIFF);

    this.options = options;
  }

  static override OutputType(options: DateDiffOperationOptions): TypedEntity {
    return createTypedEntity({ type: 'int', unit: options.unit_name ?? options.unit });
  }

  compile() {
    return {
      $switch: {
        branches: [
          { case: { $in: ['$' + this.options.from, ['', null, 'null']] }, then: null },
          { case: { $in: ['$' + this.options.to, ['', null, 'null']] }, then: null },
        ],
        default: {
          $dateDiff: {
            startDate: '$' + this.options.from,
            endDate: '$' + this.options.to,
            unit: this.options.unit
          }
        }
      }
    }
  }
}