import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export interface MinmaxOperationOptions {
  value: string | number;
  min: number | string | null;
  max: number | string | null;
}

export class MinmaxOperation extends AggrOperation<MinmaxOperationOptions> {

  constructor(options: MinmaxOperationOptions) {
    super(AggrOperationType.MINMAX);

    this.options = options;
  }

  static override OutputType(): TypedEntity {
    return createTypedEntity({ type: 'int' });
  }

  compile() {
    if (this.options.min !== undefined && this.options.max !== undefined)
      return {
        $switch: {
          branches: [
            { case: { $gte: ['$' + this.options.value, this.options.max] }, then: this.options.max },
            { case: { $lte: ['$' + this.options.value, this.options.min] }, then: this.options.min }
          ],
          default: '$' + this.options.value
        }
      }

    if (this.options.max !== undefined)
      return {
        $cond: [{ $gte: ['$' + this.options.value, this.options.max] }, this.options.max, '$' + this.options.value]
      }

    return {
      $cond: [{ $lte: ['$' + this.options.value, this.options.min] }, this.options.min, '$' + this.options.value]
    }
  }
}