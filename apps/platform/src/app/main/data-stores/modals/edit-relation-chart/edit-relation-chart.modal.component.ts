/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStoresState } from "@pestras/frontend/state";
import { ToastService, untilDestroyed } from "@pestras/frontend/ui";
import { DashboardViewSize, SubDataStore, SubDataStoreChart } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-edit-relation-chart-modal',
  templateUrl: './edit-relation-chart.modal.component.html'
})
export class EditRelationChartModalComponent implements OnInit {
  private ud = untilDestroyed();

  readonly form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    width: new FormControl<DashboardViewSize['x']>(3, { nonNullable: true, validators: Validators.required }),
    height: new FormControl<DashboardViewSize['y']>(2, { nonNullable: true, validators: Validators.required })
  });

  preloader = false;

  @Input({ required: true })
  dsSerial!: string;
  @Input({ required: true })
  relation!: SubDataStore
  @Input({ required: true })
  chart!: SubDataStoreChart

  @Output()
  closes = new EventEmitter<string | null>();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form.controls.title.setValue(this.chart.title);
    this.form.controls.width.setValue(this.chart.width as DashboardViewSize['x']);
    this.form.controls.height.setValue(this.chart.height as DashboardViewSize['y']);
  }

  edit(c: Record<string, any>) {
    this.preloader = false;

    this.state.updateRelationChart(this.dsSerial, this.relation.serial, this.chart.serial, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.closes.emit();
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}