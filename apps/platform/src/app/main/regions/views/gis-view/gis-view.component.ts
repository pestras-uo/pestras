/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService, untilDestroyed } from "@pestras/frontend/ui";
import { GISMapConfig, GISMapFeatureLayer, Region } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-gis-view',
  templateUrl: './gis-view.component.html',
  styles:[`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  `]
})
export class GisViewComponent implements OnChanges {
  private ud = untilDestroyed();

  readonly layersListForm = new FormGroup({
    layers: new FormArray<FormControl<boolean>>([])
  });

  readonly layersControls = this.layersListForm.controls.layers;
  
  gisMap: GISMapConfig | null = null;
  dialogRef: DialogRef | null = null;
  preloader = false;
  activeLayers: GISMapFeatureLayer[] = [];

  @Input({ required: true })
  region!: Region

  constructor(
    private state: RegionsState,
    private toast: ToastService,
    private dialog: Dialog
  ) { }

  ngOnChanges(): void {
    this.layersControls.clear();

    if (this.gisMap)
      for (let i = 0; i < this.gisMap.layers.length; i++)
        this.layersControls.push(new FormControl(false, { nonNullable: true }));

    this.layersListForm.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        this.activeLayers = this.gisMap
          ? this.gisMap.layers.filter((l, i) => this.layersControls.at(i).value)
          : [];
      });
  }

  openDialog(tmp: TemplateRef<unknown>, map?: GISMapConfig, layer?: GISMapFeatureLayer) {
    this.dialogRef = this.dialog.open(tmp, { data: { map, layer } });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.preloader = false;

    // if (map)
    //   this.setMap(map);

    // if (layer)
    //   this.updateLayer(layer, true);
  }

  setMap(map: GISMapConfig | null) {
    if (this.gisMap?.serial === map?.serial)
      return;

    this.gisMap = map;
    this.layersListForm.controls.layers.clear();

    if (map) {
      for (let i = 0; i < map.layers.length; i++) {
        this.layersListForm.controls.layers.push(new FormControl(false, { nonNullable: true }));
      }
    }
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
          // this.removeLayer(layer);
        },
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
        }
      });
  }
}