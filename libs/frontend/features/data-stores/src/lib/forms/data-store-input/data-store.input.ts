/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { map, startWith, switchMap, take, tap } from 'rxjs';
import { DataStoresState, BlueprintsState } from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-data-store-input',
  templateUrl: './data-store.input.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: DataStoreInput },
    { provide: NG_VALIDATORS, multi: true, useExisting: DataStoreInput }
  ]
})
export class DataStoreInput implements OnChanges, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly bp = new FormControl('', { nonNullable: true });
  readonly ds = new FormControl('', { nonNullable: true });

  readonly bps$ = this.bpsState.data$.pipe(
    map(list => list.map(bp => ({ name: bp.name, value: bp.serial }))),
    tap(list => list[0]?.value ?? '')
  );
  readonly dss$ = this.bp.valueChanges
    .pipe(
      startWith(''),
      switchMap(bp => this.state.selectGroup(bp)),
      map(list => list.map(ds => ({ name: ds.name, value: ds.serial })))
    );

  disabled = false;
  touched = false;

  @HostBinding('class')
  hostClass = 'flex gap-4';

  @Input()
  fcClass = '';
  @Input()
  blueprint: string | null = null;

  constructor(
    private state: DataStoresState,
    private bpsState: BlueprintsState
  ) { }

  ngOnChanges(): void {
    console.log(this.blueprint);
    if (this.blueprint)
      this.bp.setValue(this.blueprint);

    this.ds.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        this.onChange(v ?? null);
        this.onTouched();
      });
  }


  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(value: string): void {
    if (value) {
      this.state.select(value)
        .pipe(take(1))
        .subscribe(ds => {
          if (ds) {
            if (!this.blueprint)
              this.bp.setValue(ds.blueprint);

            setTimeout(() => this.ds.setValue(ds.serial));
          }
        })
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
