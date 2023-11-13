/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, TemplateRef, booleanAttribute } from "@angular/core";
import { DataStoresState } from "@pestras/frontend/state";
import { PuiSideDrawer, ToastService } from "@pestras/frontend/ui";
import { DataStore, SubDataStore, SubDataStoreChart } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-relation-settings',
  templateUrl: "./relations-settings.view.html",
  styleUrls: ['./relations-settings.view.scss']
})
export class RelationsSettingsComponent {

  dialogRef: DialogRef | null = null;
  relationCtx: SubDataStore | null = null;
  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ transform: booleanAttribute })
  editable = false;

  constructor(
    private state: DataStoresState,
    private dialog: Dialog,
    private drawer: PuiSideDrawer,
    private toast: ToastService
  ) { }

  getCharts = (rel: SubDataStore): SubDataStoreChart[] => {
    return rel.charts_order
      .map(s => rel.charts.find(c => c.serial === s) ?? null)
      .filter(Boolean) as SubDataStoreChart[];
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }

  openDrawer(tmp: TemplateRef<unknown>, relation: SubDataStore) {
    this.relationCtx = relation;
    this.drawer.attach(tmp);
  }

  closeDrawer() {
    this.drawer.close();
  }

  remoeveChart(c: Record<string, any>, rel: string, chart: string) {
    this.state.removeRelationChart(this.dataStore.serial, rel, chart)
      .subscribe({
        next: () => {
          this.preloader = true;
        },
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}