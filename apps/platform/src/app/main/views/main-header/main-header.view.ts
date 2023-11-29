/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef } from '@angular/core';
import { FontSizeService } from '@pestras/frontend/ui';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.view.html',
  styleUrls: ['./main-header.view.scss'],
})
export class MainHeaderView {
  readonly roles = Role;

  dialogRef: DialogRef | null = null;
  

  constructor(
    private dialog: Dialog,
    private fontSizeService: FontSizeService
  ) {}

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
  handleFontSizeChanged(fontSize: number): void {
    // Do something with the new font size
    console.log('Font size changed:', fontSize);
  }
}
