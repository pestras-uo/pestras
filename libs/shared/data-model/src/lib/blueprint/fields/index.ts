import { ValueConstraint, createTypedEntity } from "../../util";
import { TypedEntity } from "../../util";

export interface Field extends TypedEntity {
  /** 
   * for ui arrangment
   * and atomic updates
   */
  group: string;
  desc: string | null;
  /** system generated field */
  system: boolean;

  required: boolean;
  default: unknown | null;
  unique: boolean;
  /** once assigned cannot be changed */
  constant: boolean;
  /** assigned through actions */
  automated: boolean;
  /** 
   * display on create form.
   * required fields are intial fields as well
   */
  initial: boolean;

  /** validate input value */
  constraint: ValueConstraint | null;
}

const defaultField: Field = Object.assign({}, createTypedEntity({}), {
  group: 'other',
  desc: null,
  system: false,
  required: false,
  default: null,
  unique: false,
  constant: false,
  automated: false,
  initial: false,

  constraint: null
});

export function createField(field: Partial<Field>): Field {
  return Object.assign({}, defaultField, field, {
    initial: field.initial || field.required,
    default: field.default ?? (field.type?.length !== 1 ? [] : null),
  });
}