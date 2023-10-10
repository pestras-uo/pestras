/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecordsService } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataRecordState, DataStore, DataStoreType, SubDataStores, TableDataRecord } from '@pestras/shared/data-model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss']
})
export class SideMenuView implements OnChanges {

  subDataStores!: SubDataStores[];
  isTable!: boolean;
  deleteAllowed = false;
  dialogRef: DialogRef | null = null;
  preloader = false;

  @Input({ required: true })
  view!: { name: string; payload?: any; };
  @Input()
  topic: string | null = null;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: TableDataRecord;
  @Input()
  state: DataRecordState | "" = "";

  @Output()
  selects = new EventEmitter<{ name: string; payload?: any; }>();

  constructor(
    protected service: RecordsService,
    protected loc: Location,
    protected dialog: Dialog,
    protected router: Router,
    protected toast: ToastService
  ) {}

  ngOnChanges(): void {
    this.isTable = this.dataStore.type === DataStoreType.TABLE;
    this.subDataStores = this.dataStore.settings.sub_data_stores;
    this.deleteAllowed = this.state === DataRecordState.DRAFT || !!this.dataStore.settings.workflow.delete;
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
  }

  delete(errorMsgs: Record<string, string>) {
    this.preloader = true;

    this.service.delete({ ds: this.dataStore.serial, serial: this.record.serial, draft: this.state === DataRecordState.DRAFT ? "1" : "0" })
      .subscribe({
        next: () => {
          this.topic
            ? this.router.navigate(['/main/topics', this.topic], { replaceUrl: true })
            : this.router.navigate(['/main/data-stores', this.dataStore.blueprint, this.dataStore.serial], { queryParams: { mene: 'data' }, replaceUrl: true });
            
          this.closeDialog();
        },
        error: error => {
          console.log(error);
          this.preloader = false;
          this.toast.msg(errorMsgs[error.error ?? 'default'])
        }
      })
  }
}
