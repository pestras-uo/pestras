/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, TemplateRef, booleanAttribute } from '@angular/core';
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orgunits',
  template: `
    <app-orgunits-list [selected]="selected" (selects)="set($event)" [isPartners]="isPartners" (add)="openModal(modal)"></app-orgunits-list>

    <app-orgunit-details [serial]="selected" (selects)="set($event)" [isPartners]="isPartners" (add)="openModal(modal, $event)"></app-orgunit-details>

    <ng-template #modal let-data>
      <app-create-orgunit [parent]="data" [isPartner]="isPartners" (closes)="closeModal()"></app-create-orgunit>
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

  @Input({ transform: booleanAttribute })
  isPartners!: boolean;
  @Input()
  set orgunit(value: string) {
    this.selected = value ?? '';
  }

  constructor(
    private dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  set(serial: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { orgunit: serial }, queryParamsHandling: 'merge' });
  }

  openModal(modal: TemplateRef<any>, parent?: string) {
    this.dialogRef = this.dialog.open(modal, {
      data: parent
    });
  }

  closeModal(serial?: string) {
    if (serial)
      this.set(serial);

    !!this.dialogRef && this.dialogRef.close();
  }
}
