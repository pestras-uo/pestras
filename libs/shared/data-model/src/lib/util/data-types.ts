/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseLocation, Serial } from "@pestras/shared/util";

// basic types list
// --------------------------------------------------------------------------------------------------
export const typesNames = [
  'int',
  'double',
  'datetime',
  // 'time',
  'date',
  'string',
  'boolean',
  'serial',
  'region',
  'category',
  'location',
  'image',
  'file',
  'unknown'
] as const;

export const referenceTypes = ['orgunit', 'data_store', 'user', 'topic'] as const;


// Types
// --------------------------------------------------------------------------------------------------
export type TypesNames = typeof typesNames[number];
export type ReferenceTypes = typeof referenceTypes[number];

export enum TypeKind {
  NONE = 'none',
  ORDINAL = 'ordinal',
  RICH_TEXT = 'rich_text',
  LINK = 'link'
}

export interface TypedEntity {
  name: string;
  display_name: string;
  type: TypesNames;
  kind: TypeKind;
  unit: string | null;
  ref_type: ReferenceTypes | null;
  ref_to: string | null;
  length: number;
  mime: string[];
}

const defaultTypedEntity: TypedEntity = {
  name: 'field',
  display_name: 'field',
  type: 'int',
  kind: TypeKind.NONE,
  ref_type: null,
  ref_to: null,
  unit: null,
  mime: [],
  length: 1
}

export function createTypedEntity(type: Partial<TypedEntity>): TypedEntity {
  return Object.assign({}, defaultTypedEntity, type);
}


// Validations
// --------------------------------------------------------------------------------------------------
const basicTypeValidators: Record<TypesNames, (value: any) => any> = {
  category: (value: any) => typeof value === 'string' ? value : null,
  image: (value: any) => value ?? null,
  region: (value: any) => typeof value === 'string' ? value : null,
  file: (value: any) => value ?? null,
  unknown: (value: any) => value ?? null,
  serial: (value: any) => Serial.isValid(value) ? value : null,
  boolean: (value: any) => value === 'true' ? true : (value === 'false' ? false : !!value),
  int: (value: any) => Number.isInteger(+value) ? +value : null,
  double: (value: any) => typeof value === 'number' && isFinite(value) && Math.floor(value) !== Math.ceil(value) ? +value : null,
  string: (value: any) => typeof value === "string" ? value : null,
  date: (value: any) => new Date(value).toString() !== 'Invalid Date' ? new Date(value) : null,
  // time: (value: any) => parseTime(value),
  datetime: (value: any) => new Date(value).toString() !== 'Invalid Date' ? new Date(value) : null,
  location: (value: any) => parseLocation(value)
};

export function validateValueType(value: any, entity: TypedEntity): any {
  if (entity.length !== 1 && Array.isArray(value)) {
    if (!value.every((v: any) => basicTypeValidators[entity.type](v) !== null))
      return null;

    return value.map((v: any) => basicTypeValidators[entity.type](v) as any);
  }

  if (entity.length !== 1)
    return null;

  if (entity.type === 'category')
    return entity.kind === TypeKind.ORDINAL ? basicTypeValidators.int(value) : basicTypeValidators.category(value);

  return basicTypeValidators[entity.type](value) as any;
}

export function parseValue(value: any): any {
  if (Array.isArray(value))
    return value.map(v => parseValue(v));

  if (value === 'false')
    return false;

  if (value === 'true')
    return true;

  if ((typeof value === 'string' && value.trim() === '') || value === 'null' || value === undefined || value === null)
    return null;

  return value;
}