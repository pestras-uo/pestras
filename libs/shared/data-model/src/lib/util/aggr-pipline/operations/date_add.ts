/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrOperation, AggrOperationType } from '.';
import { TypedEntity, createTypedEntity } from '../../data-types';
import { DateUnit } from './modifiers';

export interface DateAddOperationOptions {
  field: any;
  amount: { unit: DateUnit; value: number; }[];
}

export class DateAddOperation extends AggrOperation<DateAddOperationOptions> {

  constructor(options: DateAddOperationOptions) {
    super(AggrOperationType.DATE_ADD);

    this.options = options;
  }

  static override OutputType(): TypedEntity {
    return createTypedEntity({ type: 'datetime' });
  }

  compile() {
    return {
      $cond: {
        if: { $in: ['$' + this.options.field, ['', null, 'null']] },
        then: null,
        else: {
          $dateFromParts: {
            year: { $add: [{ $year: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'year')?.value || 0] },
            month: { $add: [{ $month: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'month')?.value || 0] },
            day: { $add: [{ $dayOfMonth: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'day')?.value || 0] },
            hour: { $add: [{ $hour: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'hour')?.value || 0] },
            minute: { $add: [{ $minute: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'minute')?.value || 0] },
            second: { $add: [{ $second: '$' + this.options.field }, this.options.amount.find(a => a.unit === 'second')?.value || 0] }
          }
        }
      }
    }
  }
}