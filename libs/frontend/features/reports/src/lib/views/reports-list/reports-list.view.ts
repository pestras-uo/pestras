/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Report, Role } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { ReportsState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.view.html',
  styles: [`
    :host { display: block; }
  `]
})
export class ReportsListView implements OnChanges {
  readonly roles = Role;

  reports$!: Observable<Report[]>;
  dialogRef: DialogRef | null = null;
  preloader = false;

  readonly title = new FormControl('', { validators: Validators.required, nonNullable: true });

  @Input({ required: true })
  topic!: string;

  constructor(
    private state: ReportsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.reports$ = this.state.selectGroup(this.topic);
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;

    this.title.reset();
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.topic, this.title.value)
      .subscribe({
        next: r => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeDialog();
          this.router.navigate(['/main/reports', r.topic, r.serial]);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
