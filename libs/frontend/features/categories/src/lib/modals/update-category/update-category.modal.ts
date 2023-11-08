/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Category, CategoryType } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { CategoriesService } from '@pestras/frontend/state';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.modal.html'
})
export class UpdateCategoryModal implements OnInit {
  private ud = untilDestroyed();

  readonly ordinalValue = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });
  readonly ordinalRangeStart = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });
  readonly ordinalRangeEnd = new FormControl<number>(0, { nonNullable: true, validators: Validators.required });

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    type: this.fb.control<CategoryType>('nominal', { nonNullable: true, validators: Validators.required }),
    value: this.fb.nonNullable.control<string | number | [number, number]>('', { validators: Validators.required })
  });

  readonly type = this.form.controls.type;
  readonly title = this.form.controls.title;
  readonly value = this.form.controls.value;

  preloader = false;
  isRoot = false;

  @Input({ required: true })
  category!: Category;

  @Output()
  closes = new EventEmitter<boolean>();

  constructor(
    private service: CategoriesService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.isRoot = Serial.isRoot(this.category.serial);
    this.form.controls.title.setValue(this.category.title);
    this.form.controls.type.setValue(this.category.type);
    this.form.controls.value.setValue(this.category.value);

    this.title.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        if (this.type.value === 'nominal' || this.isRoot)
          this.value.setValue(v);
      });

    if (!this.isRoot) {
      if (this.type.value === 'ordinal')
        this.ordinalValue.setValue(this.value.value as number);
      else if (this.type.value === 'ordinal_range') {
        this.ordinalRangeStart.setValue((this.value.value as [number, number])[0]);
        this.ordinalRangeEnd.setValue((this.value.value as [number, number])[1]);
      }

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

  update(c: Record<string, any>) {
    this.preloader = true;

    this.service.update({ serial: this.category.serial }, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
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
