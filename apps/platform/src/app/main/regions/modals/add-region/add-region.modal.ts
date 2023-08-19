/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Region } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { RegionsState } from '@pestras/frontend/state';
import { GeoLocation } from '@pestras/shared/util'


@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.modal.html'
})
export class AddRegionModal {

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    location: new FormControl<GeoLocation | null>(null, Validators.required),
    zoom: [13, Validators.required],
    parent: ''
  });
  
  preloader = false;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: RegionsState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  mapRegion = (r: Region) => ({ name: r.name, value: r.serial });
  mapType = (t: string) => ({ name: t, value: t });

  add(c: Record<string, any>) {
    this.preloader = true;

    const { name, location, parent, type, zoom } = this.form.getRawValue();

    if (!location)
      return;

    this.state.create({ name, location, parent, type, zoom })
      .subscribe({
        next: r => {
          this.toast.msg(c['success'].regionAdd, { type: 'success' });
          this.closes.emit(r.serial);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

}
