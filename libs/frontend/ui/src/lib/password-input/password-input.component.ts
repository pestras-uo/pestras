/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, forwardRef } from '@angular/core';
import {
  FormControl,
  ControlContainer,
  NgForm,
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'pui-password-input',
  template: `
    <div [formGroup]="parentForm">
      <div class="input-wrapper">
        <i
          class="cursor-pointer flex-col icon"
          size="small"
          (click)="togglePasswordVisibility()"
          [puiIcon]="showPassword ? 'eye' : 'eye-slash'"
        ></i>
        <input
          type="{{ showPassword ? 'text' : 'password' }}"
          formControlName="{{ formControlName }}"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .input-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
      }

      .password-input {
        padding-right: 30px; /* Adjust this value to leave space for the icon */
      }

      .icon {
        position: absolute;
        right: 8px; /* Adjust this value to control the distance from the right edge of the input */
        cursor: pointer;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PuiPasswordInput),
      multi: true,
    },
  ],
})
export class PuiPasswordInput implements ControlValueAccessor {
  @Input() formControlName = '';
  eyeIcons: { open: string; slash: string } = {
    open: 'eye',
    slash: 'eye-slash',
  };
  @Input() showPassword = false;
  @Input() parentForm!: FormGroup;
  @Input() id = '';

  showEyeIcon = true;

  togglePasswordVisibility() {
    // if (field === 'currentPassword') {
    //   this.showCurrentPassword = !this.showCurrentPassword;
    // } else if (field === 'newPassword') {
    //   this.showNewPassword = !this.showNewPassword;
    // }
    this.showPassword = !this.showPassword;

    this.showEyeIcon = !this.showEyeIcon;
  }

  private _value = ''; // Internal variable to store the input value

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this._value = value; // Update the internal value when the form control changes
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange; // Save the provided callback function to update the form control value
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched; // Save the provided callback function to mark the control as touched
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabling/enabling the input field if necessary
  }

  // Methods to update the form control value
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Method to update the input value and notify the form control
  updateValue(value: string): void {
    this._value = value;
    this.onChange(this._value);
    this.onTouched();
  }
}
