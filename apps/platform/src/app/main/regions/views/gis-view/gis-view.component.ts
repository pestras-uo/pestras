/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, TemplateRef } from "@angular/core";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapConfig, GISMapFeatureLayer, Region } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-gis-view',
  templateUrl: './gis-view.component.html'
})
export class GisViewComponent {

  gisMap = '';
  dialogRef: DialogRef | null = null;
  preloader = false;

  @Input({ required: true })
  region!: Region

  constructor(
    private state: RegionsState,
    private toast: ToastService,
    private dialog: Dialog
  ) { }

  openDialog(tmp: TemplateRef<unknown>, map?: GISMapConfig, layer?: GISMapFeatureLayer) {
    this.dialogRef = this.dialog.open(tmp, { data: { map, layer } });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.preloader = false;
  }

  removeGisMap(c: Record<string, any>, map: string) {
    this.preloader = true;

    this.state.removeGisMap(this.region.serial, map)
      .subscribe({
        next: () => this.closeDialog(),
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
        }
      });
  }

  removeGisMapLayer(c: Record<string, any>, map: string, layer: string) {
    this.preloader = true;

    this.state.removeGisMapLayer(this.region.serial, map, layer)
      .subscribe({
        next: () => this.closeDialog(),
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
        }
      });
  }
}