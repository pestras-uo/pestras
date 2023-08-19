/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { objUtil } from "@pestras/shared/util";

export const FormValidators = {
  changed(state: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return objUtil.equals(state, control.value)
        ? { changed: true }
        : null;
    }
  }
}