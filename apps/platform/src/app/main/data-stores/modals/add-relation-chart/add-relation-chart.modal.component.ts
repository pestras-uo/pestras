/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStoresState } from "@pestras/frontend/state";
import { ToastService, untilDestroyed } from "@pestras/frontend/ui";
import { DashboardViewSize, DataStore, DataVizTypes, Field, SubDataStore, TypeKind } from "@pestras/shared/data-model";
import { distinctUntilChanged } from "rxjs";

@Component({
  selector: 'pestras-add-relation-chart-modal',
  templateUrl: './add-relation-chart.modal.component.html'
})
export class AddRelationChartModalComponent implements OnInit {
  private ud = untilDestroyed();

  readonly form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    width: new FormControl<DashboardViewSize['x']>(3, { nonNullable: true, validators: Validators.required }),
    height: new FormControl<DashboardViewSize['y']>(2, { nonNullable: true, validators: Validators.required }),
    options: new FormGroup({
      aggregate: new FormControl<any[]>([], { nonNullable: true }),
      type: new FormControl<DataVizTypes>(DataVizTypes.PIE, { nonNullable: true, validators: Validators.required }),
      options: new FormControl<any>(null, { validators: Validators.required })
    })
  });

  readonly chartType = this.form.controls.options.controls.type;
  readonly chartOptions = this.form.controls.options.controls.options;

  preloader = false;
  fields: Field[] = [];

  @Input({ required: true })
  dsSerial!: string;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  relation!: SubDataStore

  @Output()
  closes = new EventEmitter<string | null>();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fields = this.dataStore.fields;

    this.chartType.valueChanges
      .pipe(
        this.ud(),
        distinctUntilChanged()
      )
      .subscribe(() => this.chartOptions.setValue(null));
  }

  fieldsChange(fields: Field[]) {
    this.fields = fields;
  }

  filterFields(field: Field) {
    return ['int', 'double', 'boolean', 'category', 'region'].includes(field.type)
      || (field.type === 'string' && field.kind === TypeKind.NONE);
  }

  mapFields(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  getField(name: string, dataStore: DataStore) {
    return dataStore.fields.find(f => f.name === name);
  }

  add(c: Record<string, any>) {
    this.preloader = false;

    this.state.addRelationChart(this.dsSerial, this.relation.serial, this.form.getRawValue())
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