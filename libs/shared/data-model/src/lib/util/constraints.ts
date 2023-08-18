/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueModifier } from "./aggr-pipline";

export interface ValueConstraint {
  modifiers: ValueModifier[];
  values: any[];
  inverse: boolean;
}


export function modifyValue(value: any, type: string, modifiers: ValueModifier[]) {
  let result: { value: any, type: string } = { value, type };

  for (const modifier of modifiers)
    result = valueModifier[modifier](result.value);

  return result;
}

export const valueModifier: Record<string, (value: any) => { value: any, type: string }> = {
  boolean: (v: any) => ({ value: !!v, type: 'boolean' }),
  int: (v: any) => ({ value: +v, type: 'int' }),
  double: (v: any) => ({ value: +v, type: 'double' }),
  string: (v: any) => ({ value: "" + v, type: 'string' }),
  date: (v: any) => ({ value: new Date(v), type: 'date' }),

  year: (date: any) => ({ value: new Date(date).getFullYear(), type: 'int' }),
  month: (date: any) => ({ value: new Date(date).getMonth() + 1, type: 'int' }),
  day: (date: any) => ({ value: new Date(date).getDate(), type: 'int' }),

  hour: (date: any) => ({ value: new Date(date).getHours(), type: 'int' }),
  minute: (date: any) => ({ value: new Date(date).getMinutes(), type: 'int' }),
  second: (date: any) => ({ value: new Date(date).getSeconds(), type: 'int' }),

  round: (val: number) => ({ value: Math.round(val), type: 'int' }),
  floor: (val: number) => ({ value: Math.floor(val), type: 'int' }),
  ceil: (val: number) => ({ value: Math.ceil(val), type: 'int' }),
  abs: (val: number) => ({ value: Math.abs(val), type: 'double' }),

  toLower: (str: string) => ({ value: str.toLowerCase(), type: 'string' }),
  toUpper: (str: string) => ({ value: str.toUpperCase(), type: 'string' }),
  trim: (str: string) => ({ value: str.trim(), type: 'string' })
}


// validator single
// ---------------------------------------------------------------------------------------
export function validateConstraint(type: string, constraint: ValueConstraint, value: any) {
  const input = constraint.modifiers?.length ? modifyValue(value, type, constraint.modifiers) : { value, type };

  return validators[input.type](input, constraint.values, constraint.inverse);
}


// constraint validators
// --------------------------------------------------------------------------------------------
const validators: Record<string, (input: any, values: any[], inverse: boolean) => boolean> = {

  string(input: any, values: any[], inverse: boolean) {
    return inverse ? !stringToRegex(values[0]).test(input) : stringToRegex(values[0]).test(input);
  },

  boolean(input: any, values: any[], inverse: boolean) {
    return inverse ? input !== values[0] : input === values[0];
  },

  int(input: any, values: any[], _: boolean) {
    if (typeof values[0] === 'number' && typeof values[1] === 'number')
      return values[0] === values[1]
        ? input === values[0]
        : values[0] < values[1]
          ? input >= values[0] && input <= values[1]
          : input <= values[0] || input >= values[1];

    return typeof values[0] === 'number'
      ? input >= values[0]
      : input <= values[1];
  },

  double(input: any, values: any[], _: boolean) {
    return this['int'](input, values, _);
  },

  date(input: any, values: any[], _: boolean) {
    if (values[0] && values[1]) {
      const start = new Date(values[0]).getTime();
      const end = new Date(values[1]).getTime();
      const inputDate = new Date(input).getTime();

      return start < end
        ? inputDate >= start && inputDate <= end
        : inputDate <= start || inputDate >= end;
    }

    return values[0]
      ? new Date(input).getTime() >= new Date(values[0]).getTime()
      : new Date(input).getTime() <= new Date(values[1]).getTime();
  },

  datetime(input: any, values: any[], _: boolean) {
    return this['date'](input, values, _);
  },

  category(input: any, values: any[], inverse: boolean) {
    return inverse
      ? !values.includes(input)
      : values.includes(input);
  },

  serial(input: any, values: any[], inverse: boolean) {
    return this['category'](input, values, inverse);
  },

  region(input: any, values: any[], inverse: boolean) {
    return this['category'](input, values, inverse);
  }
};

function stringToRegex(regex: string) {
  if (regex.charAt(0) === '/') {
    if (regex.charAt(regex.length - 1) === '/')
      return new RegExp(regex);

    const slashIndex = regex.lastIndexOf('/');
    const flags = regex.slice(slashIndex + 1);

    return new RegExp(regex.slice(1, slashIndex), flags);
  }

  return new RegExp(regex);
}