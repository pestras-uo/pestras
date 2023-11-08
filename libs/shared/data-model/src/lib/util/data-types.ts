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
  RANGE = 'range',
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
  /** for nested categories */
  cat_level: number | null,
  parent: string | null;
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
  cat_level: null,
  parent: null,
  unit: null,
  mime: [],
  length: 1
}

export function createTypedEntity(type: Partial<TypedEntity>): TypedEntity {
  return Object.assign({}, defaultTypedEntity, type);
}


// Validations
// --------------------------------------------------------------------------------------------------

export function validateValueType(value: any, entity: TypedEntity): any {
  if (entity.length !== 1 && Array.isArray(value)) {
    if (!value.every((v: any) => castTypedEntityValue(v, entity.type) !== null))
      return null;

    return value.map((v: any) => castTypedEntityValue(v, entity.type) as any);
  }

  if (entity.length !== 1)
    return null;

  if (entity.type === 'category')
    return entity.kind === TypeKind.ORDINAL || TypeKind.RANGE ? castTypedEntityValue(value, 'int') : castTypedEntityValue(value, 'category');

  return castTypedEntityValue(value, entity.type) as any;
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

export function castTypedEntityValue(value: any, type: TypesNames) {
  if (value === null)
    return null;

  switch (type) {
    case 'boolean':
      return !!value;
    case 'category':
    case 'string':
    case 'region':
      return "" + value;
    case 'date':
    case 'datetime':
      return new Date(value).toString() !== 'Invalid Date' ? new Date(value) : null;
    case 'double':
    case 'int':
      return +value;
    case 'file':
    case 'image':
    case 'unknown':
      return value;
    case 'location':
      return parseLocation(value);
    case 'serial':
      return Serial.isValid(value) ? value : null;
  }
}

export function getInitTypedEntityValue(entity: TypedEntity) {
  switch (entity.type) {
    case 'boolean':
      return false;
    case 'string':
    case 'region':
    case 'category':
    case 'serial':
      return "";
    case 'date':
    case 'datetime':
      return new Date();
    case 'double':
    case 'int':
      return 0;
    case 'file':
    case 'image':
    case 'unknown':
      return "";
    case 'location':
      return null;
  }
}