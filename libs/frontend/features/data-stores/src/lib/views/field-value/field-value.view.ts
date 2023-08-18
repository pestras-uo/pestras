/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-field-value',
  templateUrl: './field-value.view.html'
})
export class FieldValueView {

  @Input({ required: true })
  field!: Field;
  @Input({ required: true })
  value!: any;
}
