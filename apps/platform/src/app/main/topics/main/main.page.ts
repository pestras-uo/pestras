/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@pestras/shared/data-model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss']
})
export class MainPage {

  readonly roles = Role;
  
  preloader = false;
  dialogRef: DialogRef | null = null;
  selected = '';

  @Input({ required: true })
  parent!: string | null;
  @Input({ required: true })
  set active(value: string) {
    this.selected = value ?? '';
  }

  constructor(
    private dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  set(serial: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { active: serial } });
  }

  openDialog(tmp: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(tmp, { data });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
