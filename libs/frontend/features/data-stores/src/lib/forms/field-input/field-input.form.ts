/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, ViewChild, ElementRef, SimpleChanges, OnInit, booleanAttribute } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Category, DataRecord, Field, Orgunit, Region, Topic, TypeKind, User } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-field-value-input',
  templateUrl: './field-input.form.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: FieldInputForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: FieldInputForm },
  ]
})
export class FieldInputForm implements OnChanges, OnInit, ControlValueAccessor {

  private ud = untilDestroyed();
  
  disabled = false;
  touched = false;

  control = new FormControl<any>(null);

  required = false;
  isRich = false;
  refType: 'orgunit' | 'data_store' | 'user' | 'topic' | null = null;

  @ViewChild('dateInput')
  dateInput: ElementRef | null = null;

  @Input({ required: true })
  field!: Field;
  @Input()
  multi = false;
  @Input()
  record?: DataRecord;
  @Input({ transform: booleanAttribute })
  search = false;

  ngOnChanges(change: SimpleChanges) {

    if (change['field']) {
      this.required = !!this.field.required;
      this.isRich = this.field.kind === TypeKind.RICH_TEXT;
      this.refType = this.field.ref_type ?? null;
    }

    if ((this.field as Field).required)
      this.control.setValidators(Validators.required);
  }

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        if (this.dateInput)
          this.onChange(this.dateInput.nativeElement.value ? v : null);
        else
          this.onChange(v);

        this.touched || ((this.touched = true) && this.onTouched());
      });
  }

  mapCategoryBranch(c: Category) {
    return { name: c.title, value: c.value };
  }

  mapRegion(r: Region) {
    return { name: r.name, value: r.serial };
  }

  mapOrgunit(o: Orgunit) {
    return { name: o.name, value: o.serial };
  }

  mapUser(u: User) {
    return { name: u.username, value: u.serial };
  }

  mapTopic(t: Topic) {
    return { name: t.name, value: t.serial };
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(value: any): void {
    this.control.setValue(value);
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

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
