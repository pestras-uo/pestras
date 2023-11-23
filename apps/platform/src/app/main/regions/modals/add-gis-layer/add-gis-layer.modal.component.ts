/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapConfig } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-add-gis-layer-modal',
  templateUrl: './add-gis-layer.modal.component.html'
})
export class AddGisLayerModalComponent {

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string | null>(null),
    id: new FormControl<string | null>(null)
  }, { validators: this.validator });

  preloader = false;

  @Input({ required: true })
  region!: string;
  @Input({ required: true })
  map!: GISMapConfig;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: RegionsState,
    private toast: ToastService
  ) {}

  validator(control: AbstractControl) {
    return !control.value['url'] && !control.value['id']
      ? { required: true }
      : null
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addGisMapLayer(this.region, this.map.serial, this.form.getRawValue())
      .subscribe({
        next: () => this.closes.emit(),
        error: e => {
          console.error(e);
          this.preloader = false;
          this.toast.msg(c['errors'][e.error ?? 'default'], { type: 'error' });
        }
      });
  }
}