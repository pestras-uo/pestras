/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedEntity, createTypedEntity } from "../../data-types";
import { objUtil } from "@pestras/shared/util";

export enum AggrOperationType {
  CONVERT = 'convert',
  DATE_ADD = 'date_add',
  DATE_DIFF = 'date_diff',
  MATH_EXPR = 'math_expr',
  MERGE_OBJECTS = 'merge_objects',
  MINMAX = 'minmax',
  MODIFIERS = 'modifiers',
  ROUND = 'round'
}

export abstract class AggrOperation<T = any> {
  private _options!: T;

  constructor(
    public readonly type: AggrOperationType
  ) {}

  static IsOperation(input: any): input is AggrOperation {
    return input && typeof input === 'object' && !!input.type
  }

  static OperatorOfType<T extends AggrOperation>(operator: AggrOperation, type: AggrOperationType): operator is T {
    return operator.type === type;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static OutputType(..._: any[]): TypedEntity {
    return createTypedEntity({ type: 'unknown' });
  }

  get options() {
    return this._options;
  }

  set options(value: T) {
    this._options = objUtil.cloneObject(objUtil.freezeObj(value));
  }

  abstract compile(...args: any[]): any;
}