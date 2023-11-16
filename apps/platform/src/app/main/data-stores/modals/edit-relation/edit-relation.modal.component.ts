/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStoresState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { DataStore, Field, SubDataStore } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-edit-relation-modal',
  templateUrl: './edit-relation.modal.component.html'
})
export class EditRelationModalComponent implements OnInit {

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    on: new FormGroup({
      local_field: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      foreign_field: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    })
  });

  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  relation!: SubDataStore;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.relation.name);
    this.form.controls.on.controls.local_field.setValue(this.relation.on.local_field);
    this.form.controls.on.controls.foreign_field.setValue(this.relation.on.foreign_field);
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateRelation(this.dataStore.serial, this.relation.serial, this.form.getRawValue())
      .subscribe({
        next: () => this.closes.emit(),
        error: e => {
          this.preloader = false;
          this.toast.msg(c['errors'][e?.error ?? ''] ?? c['errors'].default, { type: 'error' });
        }
      });
  }
}