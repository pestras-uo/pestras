/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Region } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { OrgunitsState, SessionState } from '@pestras/frontend/state';
import { map, shareReplay, tap } from 'rxjs';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-create-orgunit',
  templateUrl: './create-orgunit.modal.html'
})
export class CreateOrgunitModal {
  readonly parents$ = this.state.data$.pipe(
    map(list => list.filter(o => o.serial !== "*")),
    map(list => this.session.get()?.orgunit === '*'
      ? list
      : list.filter(o => Serial.isBranch(o.serial, this.session.get()?.orgunit ?? '', true))
    ),
    map(list => list.map(o => ({ name: o.name, value: o.serial, class: o.class }))),
    tap(() => {
      setTimeout(() => {
        if (this.parent)
          this.form.controls.parent.setValue(this.parent);
      })
    }),
    shareReplay(1)
  )

  readonly classes$ = this.parents$.pipe(
    map(list => Array
      .from(new Set(list.map(o => o.class)))
      .map(c => ({ name: c, value: c }))
    )
  );

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    class: ['', Validators.required],
    regions: this.fb.nonNullable.control<string[]>([]),
    parent: ''
  });

  preloader = false;

  @Input()
  parent: string | null = null;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: OrgunitsState,
    private session: SessionState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.form.getRawValue())
      .subscribe({
        next: o => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
          this.closes.emit(o.serial);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
