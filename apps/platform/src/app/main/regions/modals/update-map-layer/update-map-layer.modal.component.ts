/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapFeatureLayer } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-update-gis-layer-modal',
  templateUrl: './update-map-layer.modal.component.html'
})
export class UpdateMapLayerModalComponent implements OnInit {

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string | null>(null),
    id: new FormControl<string | null>(null)
  }, { validators: this.validator });

  preloader = false;

  @Input({ required: true })
  region!: string;
  @Input({ required: true })
  map!: string;
  @Input({ required: true })
  layer!: GISMapFeatureLayer;

  @Output()
  closes = new EventEmitter<GISMapFeatureLayer | undefined>();

  constructor(
    private state: RegionsState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.layer.name);
    this.form.controls.url.setValue(this.layer.url);
    this.form.controls.id.setValue(this.layer.id);
  }

  validator(control: AbstractControl) {
    return !control.value['url'] && !control.value['id']
      ? { required: true }
      : null
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();

    this.state.updateGisMapLayer(this.region, this.map, this.layer.serial, data)
      .subscribe({
        next: () => this.closes.emit({ ...this.layer, ...data }),
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e.error ?? 'default'], { type: 'error' });
        }
      });
  }
}