/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataStore, IAggrPiplineStage } from '@pestras/shared/data-model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-aggregation-settings',
  templateUrl: './aggregation-settings.view.html',
  styles: [
  ]
})
export class AggregationSettingsView implements OnChanges {

  readonly formControl = new FormControl('', { validators: Validators.required, nonNullable: true })
  readonly pipeline = new FormControl<IAggrPiplineStage[]>([], { nonNullable: true });

  preloader = false;
  dataStores: { name: string; value: string; }[] = [];
  editFrom = false;

  from$!: Observable<DataStore | null>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  @Output()
  done = new EventEmitter();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) { }

  ngOnChanges(): void {
    if (this.dataStore.aggr?.from) {
      this.from$ = this.state.select(this.dataStore.aggr.from)
        .pipe(tap(ds => {
          if (ds) {
            this.dataStores = [{ name: ds.name, value: ds.serial }];
            setTimeout(() => {
              this.formControl.setValue(ds.serial);
              this.formControl.disable();
            });
          }
        }));

    } else {
      this.editFrom = true;
      this.pipeline.setValue([]);
    }

    this.pipeline.setValue(this.dataStore.aggr?.pipeline || []);
  }

  save(c: Record<string, any>, from: string) {
    this.preloader = true;

    this.state.setAggregationSettings(this.dataStore.serial, {
      from, pipeline: this.pipeline.getRawValue()
    })
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
          this.editFrom = false;

        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
