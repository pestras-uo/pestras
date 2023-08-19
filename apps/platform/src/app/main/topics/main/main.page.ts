/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { Role, Topic } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss']
})
export class MainPage {

  readonly roles = Role;

  topics$!: Observable<Topic[]>;
  preloader = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  parent!: string | null;

  constructor(private dialog: Dialog) { }

  openDialog(tmp: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(tmp, { data });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
