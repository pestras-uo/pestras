/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Input, OnChanges, TemplateRef, booleanAttribute } from "@angular/core";
import { DataStoresState } from "@pestras/frontend/state";
import { PuiSideDrawer, ToastService } from "@pestras/frontend/ui";
import { DataStore, SubDataStore, SubDataStoreChart } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-relation-settings',
  templateUrl: "./relations-settings.view.html",
  styleUrls: ['./relations-settings.view.scss']
})
export class RelationsSettingsComponent implements OnChanges {

  dialogRef: DialogRef | null = null;
  relationCtx: SubDataStore | null = null;
  preloader = false;
  viewsOrder: string[][] = [];
  reorder = false;

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

  ngOnChanges(): void {
    this.viewsOrder = this.dataStore.relations.map(r => r.charts_order);
  }

  getCharts = (order: string[], index: number): SubDataStoreChart[] => {
    const rel = this.dataStore.relations[index];
    
    return order
      .map(s => rel.charts.find(c => c.serial === s) ?? null)
      .filter(Boolean) as SubDataStoreChart[];
  }

  openDialog(tmp: TemplateRef<unknown>, relation: SubDataStore | null = null, chart: SubDataStoreChart | null = null) {
    this.dialogRef = this.dialog.open(tmp, { data: { relation, chart } });
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



  drop(event: CdkDragDrop<string[]>, index: number) {
    const prevOrder = [...this.viewsOrder[index]];
    const newOrder = [...this.viewsOrder[index]]
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== newOrder[i])) {
      this.viewsOrder[index] = newOrder;
      this.updateOrder(this.dataStore.relations[index].serial, newOrder);
    }
  }

  updateOrder(rel: string, order: string[]) {
    this.state.reorderRelationCharts(this.dataStore.serial, rel, order)
      .subscribe({
        next: () => {
          //
        },
        error: e => {
          console.error(e);
        }
      });
  }

  removeRelation(c: Record<string, any>, rel: string) {
    this.preloader = true;

    this.state.removeRelation(this.dataStore.serial, rel)
      .subscribe({
        next: () => {
          this.closeDialog();
          this.preloader = false;
        },
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  removeChart(c: Record<string, any>, rel: string, chart: string) {
    this.preloader = true;

    this.state.removeRelationChart(this.dataStore.serial, rel, chart)
      .subscribe({
        next: () => {
          this.closeDialog();
          this.preloader = false;
        },
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}