/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Output, EventEmitter, TemplateRef, HostBinding } from '@angular/core';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.view.html',
  styleUrls: ['./main-header.view.scss']
})
export class MainHeaderView {
  readonly roles = Role;

  dialogRef: DialogRef | null = null;

  @HostBinding('class')
  hostClass = 'shadow-1';

  @Output()
  openDrawer = new EventEmitter();

  constructor(
    private dialog: Dialog
  ) { }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp)
  }

  openDrawerHandler(e: Event) {
    e.stopPropagation();
    this.openDrawer.emit();
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
