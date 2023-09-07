/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecordsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataRecordHistroyItem, DataStore } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'pestras-record-history',
  templateUrl: './history.view.html',
  styles: [
  ]
})
export class HistoryViewComponent implements OnInit {

  history$!: Observable<DataRecordHistroyItem[]>;
  dialogRef: DialogRef | null = null;
  preloader = false;

  selected: DataRecordHistroyItem | null = null;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: string;

  constructor(
    private state: RecordsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.history$ = this.state.history(this.dataStore.serial, this.record);
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
  }

  revert(c: Record<string, any>) {
    this.preloader = true;

    if (!this.selected)
      return;

    this.state.revertHistory(this.dataStore.serial, this.selected.serial)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });

          this.closeDialog();
          this.router.navigate(['/main', this.dataStore, this.record]);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.closeDialog();
        }
      });
  }
}
