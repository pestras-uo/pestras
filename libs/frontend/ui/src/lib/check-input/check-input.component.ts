/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit, HostBinding, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pui-check-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-input.component.html',
  styleUrls: ['./check-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: PuiCheckInput },
    { provide: NG_VALIDATORS, multi: true, useExisting: PuiCheckInput }
  ]
})
export class PuiCheckInput implements OnInit, OnDestroy, ControlValueAccessor {
  private sub: Subscription | null = null;
  private lastValue = false;

  readonly control = new FormControl<boolean | null>(false, { nonNullable: true });

  disabled = false;
  touched = false;
  value: boolean | null = false;

  @Input({ required: true })
  label!: string;
  @Input()
  color: 'primary' | 'success' | 'warn' | 'danger' = 'primary';
  @Input()
  nullable = false;
  @Input()
  @HostBinding('class.small')
  small = false;

  @Output()
  changes = new EventEmitter<boolean | null>();

  ngOnInit(): void {
    this.sub = this.control.valueChanges
      .subscribe(v => {
        this.value = v;
        this.changes.emit(v);
        this.onChange(v);
        this.touched || ((this.touched = true) || this.onTouched());
      });
  }

  ngOnDestroy(): void {
    !!this.sub && this.sub.unsubscribe();
  }

  toggle() {
    if (this.nullable) {
      typeof this.control.value === 'boolean'
        ? this.control.setValue(null)
        : this.control.setValue(this.lastValue = !this.lastValue);
    } else {
      this.control.setValue(this.lastValue = !this.lastValue);
    }
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(value: boolean | null): void {
    this.lastValue = !!value;
    this.control.setValue(value ?? null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(): ValidationErrors | null {
    return null;
  }
}
