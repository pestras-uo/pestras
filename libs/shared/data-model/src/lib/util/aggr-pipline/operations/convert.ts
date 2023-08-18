/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity, parseValue } from "../../data-types";
import { CastModifer } from "./modifiers";

export interface ConvertOperationOptions {
  input: string;
  to: CastModifer;
  onError: any;
  onNull: any;
}

export class ConvertOperation extends AggrOperation<ConvertOperationOptions> {

  constructor(options: ConvertOperationOptions) {
    super(AggrOperationType.CONVERT);

    this.options = options;
  }

  static override OutputType(input: ConvertOperationOptions): TypedEntity {
    return ['double', 'decimel'].includes(input.to)
      ? createTypedEntity({ type: 'double' })
      : ['int', 'long'].includes(input.to)
        ? createTypedEntity({ type: 'int' })
        : createTypedEntity({ type: input.to });
  }

  static IsConvertOperationOptions(options: any): options is ConvertOperationOptions {
    return options && typeof options === 'object' && options.input && options.to;
  }

  compile() {
    return {
      $convert: {
        input: '$' + this.options.input,
        to: this.options.to,
        onError: parseValue(this.options.onError),
        onNull: parseValue(this.options.onNull)
      }
    }
  }
}