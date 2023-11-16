/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, OnInit, booleanAttribute } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Orgunit, Region } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { OrgunitsState } from '@pestras/frontend/state';
import { map, tap, Observable } from 'rxjs';

@Component({
  selector: 'app-update-orgunit',
  templateUrl: './update-orgunit.modal.html'
})
export class UpdateOrgunitModal implements OnInit {
  classes$!: Observable<{ name: string, value: string}[]>;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    class: ['', Validators.required],
    regions: this.fb.nonNullable.control<string[]>([])
  });
  
  preloader = false;

  @Input({ transform: booleanAttribute })
  isPartner!: boolean;
  @Input({ required: true })
  orgunit!: Orgunit;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: OrgunitsState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.classes$ = this.state.data$.pipe(
      map(list => Array
        .from(new Set(list.map(o => o.class)))
        .map(c => ({ name: c, value: c }))
      ),
      tap(() => {
        this.form.controls.name.setValue(this.orgunit.name);
        this.form.controls.class.setValue(this.orgunit.class);
        this.form.controls.regions.setValue(this.orgunit.regions);
      })
    );
  }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.update({ serial: this.orgunit.serial }, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
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
