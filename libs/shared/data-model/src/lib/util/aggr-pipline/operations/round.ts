import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export interface RoundOperationOptions {
  value: string;
  place: number;
}

export class RoundOperation extends AggrOperation<RoundOperationOptions> {

  constructor(options: RoundOperationOptions) {
    super(AggrOperationType.ROUND);

    this.options = options;
  }

  static override OutputType(options: RoundOperationOptions): TypedEntity {
    return createTypedEntity({ type: options.place ? 'double' : 'int' });
  }

  compile() {
    return {
      $round: ['$' + this.options.value, this.options.place]
    };
  }
}