/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { RecordsService } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataRecordHistroyItem, DataStore } from '@pestras/shared/data-model';
import { Observable, tap } from 'rxjs';

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
  @Input()
  topic: string | null = null;

  @Output()
  selects = new EventEmitter<{ name: string; payload?: any; }>();

  constructor(
    private service: RecordsService,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.history$ = this.service.getHistory({ ds: this.dataStore.serial, record: this.record })
      .pipe(tap(list => list.length > 0 && (this.selected = list[0])))
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

    this.service.revertHistory({ ds: this.dataStore.serial, history: this.selected.serial })
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });

          this.closeDialog();
          this.selects.emit({ name: 'details' });
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.closeDialog();
        }
      });
  }
}
