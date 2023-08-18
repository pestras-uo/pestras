/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'pui-switch-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './switch-input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PuiSwitchInput) },
    { provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => PuiSwitchInput) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiSwitchInput implements OnChanges, ControlValueAccessor {

  values: { name: string; value: string; }[] = [];
  disabled = false;
  touched = false;

  @HostBinding('class')
  hostClass = 'fc-switch';

  @Input()
  mulit = false;
  @Input({ required: true })
  list: any[] = [];

  @Output()
  changes = new EventEmitter<any>();

  ngOnChanges() {
    if (this.values.length > 0) {
      this.values = [];
      this.emit();
    }
  }

  private emit() {
    const output = this.values.map(v => v.value);
    this.onChange(output);
    this.changes.emit(output);
    this.touched && this.onTouched(); 
  }

  has(item: { name: string; value: string; }) {
    return this.values.find(i => i.value === item.value);
  }

  toggle(item: { name: string; value: string; }) {
    this.touched = true;
    this.has(item) ? this.remove(item) : this.select(item);
  }

  select(item: { name: string; value: string; }) {
    this.mulit
      ? this.values = [...this.values, item]
      : this.values = [item];

    this.emit();
  }

  remove(item: { name: string; value: string; }) {
    this.mulit
      ? this.values = this.values.filter(v => v.value !== item.value)
      : this.values = [];

    this.emit();
  }


  // ControlValueAccessor
  // -----------------------------------------------------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(items: any) {
    const input = Array.isArray(items) ? items : [items];
    this.values = input
      .map(i => this.list.find(item => item.value === i))
      .filter(i => i !== undefined);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }

}
