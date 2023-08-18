/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@angular/forms";
import { ValueModifier } from "@pestras/shared/data-model";

export interface ConstraintFormModal {
  values: FormControl<any[]>;
  modifiers: FormControl<ValueModifier[]>;
  inverse: FormControl<boolean>;
}