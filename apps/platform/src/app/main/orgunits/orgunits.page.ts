/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, TemplateRef } from '@angular/core';
import { Dialog, DialogRef } from "@angular/cdk/dialog";

@Component({
  selector: 'app-orgunits',
  template: `
    <app-orgunits-list [selected]="selected" (selects)="selected = $event" (add)="openModal(modal)"></app-orgunits-list>

    <app-orgunit-details [serial]="selected" (selects)="selected = $event" (add)="openModal(modal, $event)"></app-orgunit-details>

    <ng-template #modal let-data>
      <app-create-orgunit [parent]="data" (closes)="closeModal()"></app-create-orgunit>
    </ng-template>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: var(--main-height);
    }
  `]
})
export class OrgunitsPage {

  addModal = false;
  dialogRef?: DialogRef;
  selected = "";

  constructor(private dialog: Dialog) { }

  openModal(modal: TemplateRef<any>, parent?: string) {
    this.dialogRef = this.dialog.open(modal, {
      data: parent
    });
  }

  closeModal(serial?: string) {
    if (serial)
      this.selected = serial;

    !!this.dialogRef && this.dialogRef.close();
  }
}
