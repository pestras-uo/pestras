/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, TypesNames, createTypedEntity } from "../../data-types";

export type CastModifer = 'double' | 'int' | 'boolean' | 'string' | 'date';
export type DateUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export type NumberModifier = 'round' | 'floor' | 'ceil' | 'abs';
export type StringModifier = 'toLower' | 'toUpper' | 'trim';

export type ValueModifier = CastModifer | DateUnit | NumberModifier | StringModifier;

export const modifiersOutoutTypeMap: Record<ValueModifier, TypesNames> = {
  abs: 'double',
  boolean: 'boolean',
  ceil: 'int',
  date: 'date',
  day: 'int',
  double: 'double',
  floor: 'int',
  hour: 'int',
  int: 'int',
  minute: 'int',
  month: 'int',
  round: 'int',
  second: 'int',
  string: 'string',
  toLower: 'string',
  toUpper: 'string',
  trim: 'string',
  year: 'int'
}

export interface ModifiersOperationOptions {
  value: any;
  modifiers: ValueModifier[];
}

export class ModifiersOperation extends AggrOperation<ModifiersOperationOptions> {

  constructor(options: ModifiersOperationOptions) {
    super(AggrOperationType.MODIFIERS);

    this.options = options;
  }

  static IsModifiersOperationOptions(options: any): options is ModifiersOperationOptions {
    return options && typeof options === 'object' && options.value && Array.isArray(options.modifiers);
  }

  static override OutputType(options: ValueModifier[] | ModifiersOperationOptions): TypedEntity {
    const lastM: string = Array.isArray(options)
      ? options[options.length - 1]
      : options.modifiers[options.modifiers.length - 1];

    if (['double'].includes(lastM))
      return createTypedEntity({ type: 'double' });

    if (['int'].includes(lastM))
      return createTypedEntity({ type: 'int' });

    if (!lastM)
      return createTypedEntity({ type: 'unknown' });

    if (['year', 'month', 'day', 'hour', 'minute', 'second', 'round', 'floor', 'ceil', 'abs', 'toInt'].includes(lastM))
      return createTypedEntity({ type: 'int' });

    if (['string', 'toLower', 'toUpper', 'trim'].includes(lastM))
      return createTypedEntity({ type: 'string' });

    if (lastM === 'boolean')
      return createTypedEntity({ type: 'boolean' });

    return createTypedEntity({ type: 'date' });
  }

  getOuputType() {
    return ModifiersOperation.OutputType(this.options);
  }

  compile() {
    if (this.options.modifiers.length === 0)
      return this.options.value;

    let result = Array.isArray(this.options.value) ? "$$this" : this.options.value;

    for (const modifier of this.options.modifiers) {
      const mod = ['double', 'long', 'int', 'decimel', 'bool', 'string', 'date'].includes(modifier)
        ? `$to${modifier.charAt(0).toUpperCase()}${modifier.slice(1)}`
        : modifier === 'day'
          ? '$dayOfMonth'
          : `$${modifier}`;

      result = { [mod]: result };
    }

    return Array.isArray(this.options.value)
      ? { $map: { input: this.options.value, in: result } }
      : result;
  }
}