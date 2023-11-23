/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, TemplateRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapConfig, GISMapFeatureLayer, Region } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-gis-view',
  templateUrl: './gis-view.component.html'
})
export class GisViewComponent {
  layers: { layer: GISMapFeatureLayer, control: FormControl<boolean> }[] = [];
  gisMap: GISMapConfig | null = null;
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

  closeDialog(map?: GISMapConfig, layer?: GISMapFeatureLayer) {
    this.dialogRef?.close();
    this.preloader = false;

    if (map)
      this.setMap(map);

    if (layer)
      this.updateLayer(layer, true);
  }

  setMap(map: GISMapConfig | null) {
    if (this.gisMap?.serial === map?.serial) {
      // in case of update
      this.gisMap = map;
      return;
    }

    this.gisMap = map;
    this.layers = [];

    if (map) {
      for (const layer of map.layers)
        this.addLayer(layer);
    }
  }

  addLayer(layer: GISMapFeatureLayer) {
    this.layers.push({ layer, control: new FormControl(true, { nonNullable: true }) });
  }

  removeLayer(serial: string) {
    this.layers = this.layers.filter(l => l.layer.serial !== serial);
  }

  layersList(layers: { layer: GISMapFeatureLayer, control: FormControl<boolean>}[]) {
    return layers.filter(l => l.control.value).map(l => l.layer);
  }

  updateLayer(layer: GISMapFeatureLayer, upsert = false) {
    const l = this.layers.find(l => l.layer.serial === layer.serial);

    if (l)
      l.layer = layer;
    else if (upsert)
      this.addLayer(layer);
  }

  removeGisMap(c: Record<string, any>, map: string) {
    this.preloader = true;

    this.state.removeGisMap(this.region.serial, map)
      .subscribe({
        next: () => {
          this.closeDialog();
          if (this.gisMap?.serial === map)
            this.setMap(null);
        },
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
        next: () => {
          this.closeDialog();
          this.removeLayer(layer);
        },
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
        }
      });
  }
}