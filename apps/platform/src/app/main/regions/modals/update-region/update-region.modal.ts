/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Region } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { RegionsState } from '@pestras/frontend/state';
import { GeoLocation } from '@pestras/shared/util';

@Component({
  selector: 'app-update-region',
  templateUrl: './update-region.modal.html'
})
export class UpdateRegionModal implements OnInit {

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    location: new FormControl<GeoLocation | null>(null, Validators.required),
    zoom: [13, Validators.required]
  });

  preloader = false;
  
  @Input({ required: true })
  region!: Region;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: RegionsState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {

    this.form.controls.name.setValue(this.region.name);
    this.form.controls.type.setValue(this.region.type);
    this.form.controls.location.setValue(this.region.location);
    this.form.controls.zoom.setValue(this.region.zoom);
  }
  
  mapType = (t: string) => ({ name: t, value: t });

  update(c: Record<string, any>) {
    this.preloader = true;

    const { name, location, type, zoom } = this.form.getRawValue();

    if (!location)
      return;

    this.state.update({ serial: this.region.serial }, { name, location, type, zoom })
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].regionAdd, { type: 'success' });
          this.closes.emit();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
