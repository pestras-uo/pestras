/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStore, Field, DataStoreSettings, DataStoreTreeViewItemConfig, Workflow } from '@pestras/shared/data-model';
import { startWith } from 'rxjs';
import { SettingsForm, SettingsFormCardView, SettingsFormTreeView } from './form-model';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { DataStoresState } from '@pestras/frontend/state';

@Component({
  selector: 'app-table-settings',
  templateUrl: './table-settings.view.html',
  styles: [],
})
export class TableSettingsView implements OnChanges, OnInit {
  private ud = untilDestroyed();

  readonly cardView = new FormControl(false, { nonNullable: true });
  readonly treeView = new FormControl(false, { nonNullable: true });
  readonly subDataStores = new FormControl(false, { nonNullable: true });
  readonly form = new FormGroup<SettingsForm>({
    static: new FormControl<boolean>(false, { nonNullable: true }),
    workflow: new FormGroup({
      create: new FormControl<string | boolean>(true, { nonNullable: true, validators: Validators.required }),
      update: new FormControl<string | boolean>(true, { nonNullable: true, validators: Validators.required }),
      delete: new FormControl<string | boolean>(true, { nonNullable: true, validators: Validators.required })
    }),
    history: new FormControl<boolean>(false, { nonNullable: true }),
    max_attachments_count: new FormControl<number>(0, { nonNullable: true }),
    interface_field: new FormControl('serial', { nonNullable: true }),
    primary_field: new FormControl(null)
  });

  readonly allowCreateCtrl = new FormControl<boolean>(true);
  readonly allowUpdateCtrl = new FormControl<boolean | null>(true);
  readonly allowDeleteCtrl = new FormControl<boolean | null>(true);

  static = this.form.controls.static;
  workflow = this.form.controls.workflow;
  history = this.form.controls.history;
  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private readonly state: DataStoresState,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.form.controls.primary_field.setValue(this.dataStore.settings.primary_field ?? null);
    this.form.controls.interface_field.setValue(this.dataStore.settings.interface_field ?? 'serial');
    this.form.controls.workflow.setValue(this.dataStore.settings.workflow);
    this.form.controls.static.setValue(!!this.dataStore.settings.static);
    this.form.controls.history.setValue(!!this.dataStore.settings.history);
    this.form.controls.max_attachments_count.setValue(
      this.dataStore.settings.max_attachments_count ?? 0
    );
    
    const allowNew = this.dataStore.settings.workflow.create === true;
    const allowUpdate = typeof this.dataStore.settings.workflow.update === 'boolean' ? this.dataStore.settings.workflow.update : null;
    const allowDelete = typeof this.dataStore.settings.workflow.delete === 'boolean' ? this.dataStore.settings.workflow.delete : null;
    
    this.allowCreateCtrl.setValue(allowNew || false);
    this.allowUpdateCtrl.setValue(allowUpdate);
    this.allowDeleteCtrl.setValue(allowDelete);

    if (this.dataStore.settings.card_view) {
      this.cardView.setValue(true);
      this.form.controls.card_view?.setValue(this.dataStore.settings.card_view);
    }

    if (this.dataStore.settings.tree_view) {
      this.treeView.setValue(true);

      setTimeout(() => {
        this.form.controls.tree_view?.clear();
        for (const entry of (this.dataStore.settings.tree_view ?? []))
          this.addTreeViewItem(entry);
      });
    }
  }

  ngOnInit(): void {
    this.cardView.valueChanges
      .pipe(startWith(this.cardView.value), this.ud())
      .subscribe((isCard) =>
        isCard ? this.enableCardView() : this.form.removeControl('card_view')
      );

    this.treeView.valueChanges
      .pipe(startWith(this.treeView.value), this.ud())
      .subscribe((isTree) =>
        isTree ? this.enableTreeView() : this.form.removeControl('tree_view')
      );

    this.allowCreateCtrl.valueChanges
      .pipe(this.ud())
      .subscribe(value => this.form.controls.workflow.controls.create.setValue(value ? true : ""));

    this.allowUpdateCtrl.valueChanges
      .pipe(this.ud())
      .subscribe(value => this.form.controls.workflow.controls.update.setValue(value ?? ""));

    this.allowDeleteCtrl.valueChanges
      .pipe(this.ud())
      .subscribe(value => this.form.controls.workflow.controls.delete.setValue(value ?? ""));
  }

  enableCardView() {
    this.form.addControl(
      'card_view',
      new FormGroup<SettingsFormCardView>({
        title: new FormControl(this.dataStore.settings.card_view?.title || '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        image: new FormControl(
          this.dataStore.settings.card_view?.image || null
        ),
        details: new FormControl<string[]>(
          this.dataStore.settings.card_view?.details || [],
          { nonNullable: true }
        ),
      })
    );
  }

  enableTreeView() {
    this.form.addControl('tree_view', new FormArray<FormGroup<SettingsFormTreeView>>([
      new FormGroup<SettingsFormTreeView>({
        field: new FormControl('', { nonNullable: true, validators: Validators.required }),
        display_field: new FormControl(null)
      })
    ]));
  }

  addTreeViewItem(entry?: DataStoreTreeViewItemConfig) {
    if (this.form.controls.tree_view) {
      this.form.controls.tree_view.push(new FormGroup<SettingsFormTreeView>({
        field: new FormControl(entry?.field || '', { nonNullable: true, validators: Validators.required }),
        display_field: new FormControl(entry?.display_field ?? null)
      }));
    }
  }

  filterTreeDisplayField(field: Field) {
    return ['string', 'category', 'region', 'date', 'datetime'].includes(field.type);
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  mapDataStore(ds: DataStore) {
    return { name: ds.name, value: ds.serial };
  }

  filterRegionField(field: Field) {
    return field.type === 'region';
  }

  imageFields(field: Field) {
    return field.type === 'image';
  }

  mapWorkflow(wf: Workflow) {
    return { name: wf.name, value: wf.serial };
  }

  set(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();
    const payload: DataStoreSettings = {
      primary_field: data.primary_field,
      interface_field: data.interface_field,
      static: data.static,
      workflow: data.workflow,
      history: data.history,
      max_attachments_count: data.max_attachments_count,
      card_view: data.card_view ?? null,
      tree_view: data.tree_view ?? null
    };

    this.state.setTableSettings(this.dataStore.serial, payload).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.preloader = false;
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.preloader = false;
      },
    });
  }
}
