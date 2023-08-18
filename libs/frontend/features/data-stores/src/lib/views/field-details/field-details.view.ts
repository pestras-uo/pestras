/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { DataStore, Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.view.html',
  styles: []
})
export class FieldDetailsView {

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  field!: Field;
  @Input()
  editable = false;

  findType(type: { name: string; value: string; }, field: Field) {
    return type.value === field.type;
  }

  findConstraintOperator(operator: { name: string; value: string; }, value: string) {
    return operator.value === value;
  }
}
