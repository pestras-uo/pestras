/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, OnInit, TemplateRef } from '@angular/core';
import { Field, TypesNames, modifiersOutoutTypeMap } from '@pestras/shared/data-model';

@Component({
  selector: 'app-field-constraints',
  templateUrl: './field-constraints.view.html',
  styles: [
  ]
})
export class FieldConstraintsView implements OnChanges, OnInit {
  private dialogRef: DialogRef | null = null;

  supportConstraints = false;
  type!: TypesNames;

  @Input({ required: true })
  dataStore!: string;
  @Input({ required: true })
  field!: Field;
  @Input()
  editable = false;

  constructor(private dialog: Dialog) { }

  ngOnChanges(): void {
    this.type = this.field.constraint?.modifiers.length
      ? modifiersOutoutTypeMap[this.field.constraint?.modifiers.slice(-1)[0]]
      : this.field.type;
  }

  ngOnInit(): void {
    this.supportConstraints = !['unknown', 'location', 'image', 'file', 'serial'].includes(this.field.type);
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
