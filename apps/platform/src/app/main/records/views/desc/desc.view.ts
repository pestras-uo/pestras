/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { DataRecord, DataStore, DataStoreType, Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-desc',
  templateUrl: './desc.view.html',
  styles: []
})
export class DescView implements OnChanges {

  private dialogRef: DialogRef | null = null;

  preloader = false;
  groups: { group: string; fields: Field[]; }[] = [];
  others: Field[] = [];
  isTable!: boolean;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: DataRecord;

  constructor(
    private dialog: Dialog
  ) { }

  ngOnChanges(): void {
    this.isTable = this.dataStore.type === DataStoreType.TABLE;
    this.groups = [];

    for (const field of this.dataStore.fields) {

      if (field.system)
        continue;

      if (!field.group) {
        this.others.push(field);
        continue;
      }

      const group = this.groups.find(g => g.group === field.group);

      if (group)
        group.fields.push(field);
      else
        this.groups.push({ group: field.group, fields: [field] });
    }
  }

  openModal(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeModal() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
