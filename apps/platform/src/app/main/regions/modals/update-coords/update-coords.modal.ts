/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Region, RegionCoords } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { RegionsState } from '@pestras/frontend/state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-coords',
  templateUrl: './update-coords.modal.html'
})
export class UpdateCoordsModal implements OnInit, OnDestroy {
  private sub?: Subscription;

  readonly fileControl = new FormControl<File[] | null>(null, Validators.required);

  preloader = false;
  coords: RegionCoords | null = null;
  error: string | null = null;

  @Input({ required: true })
  region!: Region;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: RegionsState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.sub = this.fileControl.valueChanges
      .subscribe(files => {
        const file = files?.[0];

        this.coords = null;
        this.error = null;

        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent<FileReader>) => this.parseCoords(ev);
        reader.readAsText(file);
      });
  }

  parseCoords(ev: ProgressEvent<FileReader>) {
    const str = ev.target?.result;

    if (!str)
      return;
    
    try {

      const data: any = JSON.parse(str as string);

      if (typeof data !== 'object' || !data['geometry'])
        throw 'invalidData';
      else
        this.coords = { coordinates: data['geometry']['coordinates'], type: data['geometry']['type'] };

    } catch (_) {
      this.error = 'invalidData';
    }
  }

  ngOnDestroy(): void {
    !!this.sub && this.sub.unsubscribe();
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    if (!this.coords)
      return;

    this.state.updateCoords({ serial: this.region.serial }, this.coords)
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
