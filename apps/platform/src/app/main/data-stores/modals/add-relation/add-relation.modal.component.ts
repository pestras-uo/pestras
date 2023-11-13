/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStoresState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { DataStore, Field } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-add-relation-modal',
  templateUrl: './add-relation.modal.component.html'
})
export class AddRelationModalComponent {

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    data_store: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    on: new FormGroup({
      local_field: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      foreign_field: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    })
  });

  readonly ds = this.form.controls.data_store;

  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) { }

  mapDataStore(ds: DataStore) {
    return { name: ds.name, value: ds.serial };
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addRelation(this.dataStore.serial, this.form.getRawValue())
      .subscribe({
        next: () => this.closes.emit(),
        error: e => {
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? ''] ?? c['errors'].default, { type: 'error' });
        }
      });
  }
}