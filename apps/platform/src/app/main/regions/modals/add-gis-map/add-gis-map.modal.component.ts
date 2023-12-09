/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RegionsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { GISMapConfig } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-add-gis-map-modal',
  templateUrl: './add-gis-map.modal.component.html'
})
export class AddGisMapModalComponent {

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    basemap: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    id: new FormControl<string | null>(null),
    portal: new FormControl<string | null>(null),
    apiKey: new FormControl<string | null>(null)
  });

  preloader = false;

  @Input({ required: true })
  region!: string;

  @Output()
  closes = new EventEmitter<GISMapConfig | undefined>();

  constructor(
    private state: RegionsState,
    private toast: ToastService
  ) {}

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addGisMap(this.region, this.form.getRawValue())
      .subscribe({
        next: map => this.closes.emit(map),
        error: e => {
          console.error(e);
          this.toast.msg(c['errors'][e?.error ?? 'default'], { type: 'error' });
          this.preloader = false;
        }
      });
  }
}