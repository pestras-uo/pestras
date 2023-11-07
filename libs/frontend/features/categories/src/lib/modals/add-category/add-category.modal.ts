/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Category, CategoryType } from '@pestras/shared/data-model';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { CategoriesService } from '@pestras/frontend/state';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.modal.html'
})
export class AddCategoryModal implements OnInit {
  private ud = untilDestroyed();

  readonly ordinalValue = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });
  readonly ordinalRangeStart = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });
  readonly ordinalRangeEnd = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });

  readonly form = this.fb.nonNullable.group({
    blueprint: '',
    title: ['', [Validators.required, Validators.minLength(3)]],
    type: this.fb.nonNullable.control<CategoryType>('nominal', Validators.required),
    value: this.fb.nonNullable.control<string | number | [number, number]>('', { validators: Validators.required }),
    levels: this.fb.nonNullable.control<number>(1, [Validators.min(1)]),
    parent: this.fb.control('')
  });

  readonly type = this.form.controls.type;
  readonly title = this.form.controls.title;
  readonly value = this.form.controls.value;

  preloader = false;

  @Input({ required: true })
  bp!: string;
  @Input()
  parent?: Category;

  @Output()
  closes = new EventEmitter<boolean>();

  constructor(
    private service: CategoriesService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.type.valueChanges
      .pipe(this.ud())
      .subscribe(type => {
        if (type === 'nominal')
          this.value.setValue(this.title.value);
        else if (type === 'ordinal')
          this.value.setValue(this.ordinalValue.value);
        else
          this.value.setValue([this.ordinalRangeStart.value, this.ordinalRangeEnd.value]);
      })

    this.title.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        if (this.type.value === 'nominal' || !this.parent)
          this.value.setValue(v);
      });

    if (this.parent) {
      this.form.controls.type.setValue(this.parent.type);

      this.ordinalValue.valueChanges
        .pipe(this.ud())
        .subscribe(v => {
          if (this.type.value === 'ordinal')
            this.value.setValue(v);
        });

      this.ordinalRangeStart.valueChanges
        .pipe(this.ud())
        .subscribe(v => {
          if (this.type.value === 'ordinal_range')
            this.value.setValue([v, this.ordinalRangeEnd.value]);
        });

      this.ordinalRangeEnd.valueChanges
        .pipe(this.ud())
        .subscribe(v => {
          if (this.type.value === 'ordinal_range')
            this.value.setValue([this.ordinalRangeStart.value, v]);
        });
    }
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();

    data.blueprint = this.bp;
    data.parent = this.parent?.serial ?? null;

    this.service.create(data)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].categoryAdd, { type: 'success' });
          this.closes.emit(true);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
