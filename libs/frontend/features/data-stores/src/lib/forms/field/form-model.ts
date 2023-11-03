/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@angular/forms";
import { ReferenceTypes, TypeKind, TypesNames } from "@pestras/shared/data-model";

export interface FieldFormModel {
  name: FormControl<string>,
  display_name: FormControl<string>,
  group: FormControl<string>,
  type: FormControl<TypesNames>,
  kind: FormControl<TypeKind>,
  unit: FormControl<string | null>,
  ref_type: FormControl<ReferenceTypes | null>;
  ref_to: FormControl<string | null>;
  cat_level: FormControl<number | null>;
  parent: FormControl<string | null>;
  length: FormControl<number>;
  mime: FormControl<string[]>;
  required: FormControl<boolean>;
  unique: FormControl<boolean>;
  initial: FormControl<boolean>;
  constant: FormControl<boolean>;
  default: FormControl<any>;
  desc: FormControl<string | null>;
}