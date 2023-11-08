/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStore, Region, Field, Category, TypeKind, CategoryType } from '@pestras/shared/data-model';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { DataStoresState } from '@pestras/frontend/state';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { FieldFormModel } from './form-model';
import { objUtil } from '@pestras/shared/util';

@Component({
  selector: 'app-field-form',
  templateUrl: './field.form.html',
})
export class FieldForm implements OnInit {
  private ud = untilDestroyed();

  readonly kind = TypeKind;
  readonly catTypeControl = new FormControl<CategoryType>('nominal', { nonNullable: true });

  readonly form = new FormGroup<FieldFormModel>({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    display_name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    group: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    type: new FormControl('int', {
      nonNullable: true,
      validators: Validators.required,
    }),
    kind: new FormControl(TypeKind.NONE, {
      nonNullable: true,
      validators: Validators.required,
    }),
    unit: new FormControl(null),
    ref_type: new FormControl(null),
    ref_to: new FormControl(null),
    cat_level: new FormControl(null),
    parent: new FormControl(null),
    length: new FormControl(1, {
      nonNullable: true,
      validators: Validators.required,
    }),
    mime: new FormControl([], { nonNullable: true }),
    required: new FormControl(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    unique: new FormControl(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    initial: new FormControl(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    constant: new FormControl(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    default: new FormControl<any>(null),
    desc: new FormControl(null),
  });

  readonly typeField = this.form.controls.type;
  readonly kindControl = this.form.controls.kind;
  readonly refTypeControl = this.form.controls.ref_type;
  readonly refToControl = this.form.controls.ref_to;
  readonly addDefault$ = combineLatest([
    this.form.controls.required.valueChanges.pipe(
      startWith(this.form.controls.required.value)
    ),
    this.form.controls.unique.valueChanges.pipe(
      startWith(this.form.controls.unique.value)
    ),
    this.form.controls.constant.valueChanges.pipe(
      startWith(this.form.controls.constant.value)
    ),
    this.form.controls.type.valueChanges.pipe(
      startWith(this.form.controls.type.value)
    ),
  ]).pipe(
    map(
      (inp) =>
        !inp[0] &&
        !inp[1] &&
        !inp[2] &&
        !['image', 'serial'].includes(inp[3])
    )
  );

  groups: { name: string; value: string }[] = [];
  preloader = false;

  // form accessors

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  field: Field | null = null;

  @Output()
  done = new EventEmitter();

  constructor(
    private readonly state: DataStoresState,
    private readonly toast: ToastService
  ) { }

  ngOnInit(): void {
    this.groups = [
      ...new Set(
        (this.dataStore.fields as Field[]).map((f) => f.group).filter(Boolean)
      ),
    ].map((g) => ({ name: g, value: g }));

    if (this.field)
      this.form.setValue(
        objUtil.omit(this.field, ['system', 'automated', 'constraint'])
      );

    this.typeField.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        this.catTypeControl.setValue('nominal');
      });

    this.catTypeControl.valueChanges
      .pipe(this.ud())
      .subscribe(t => this.kindControl.setValue(t === 'nominal' ? TypeKind.NONE : t === 'ordinal' ? TypeKind.ORDINAL : TypeKind.RANGE));
  }

  toggleKind(checked: boolean, value: TypeKind) {
    console.log(checked, value);
    checked
      ? this.form.controls.kind.setValue(value)
      : this.form.controls.kind.setValue(TypeKind.NONE);
  }

  mapCategory(cat: Category) {
    return { name: cat.title, value: cat.serial };
  }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  mapDs(ds: DataStore) {
    return { name: ds.name, value: ds.serial };
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  submit(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();
    const req: Observable<Field | string | null> = this.field
      ? this.state.updateFieldConfig(
        this.dataStore.serial,
        this.field.name,
        data
      )
      : this.state.addField(this.dataStore.serial, data);

    req.subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.done.emit();
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
