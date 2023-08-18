/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { ToastService } from '@pestras/frontend/ui';
import { CategoriesState } from '@pestras/frontend/state';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.modal.html'
})
export class UpdateCategoryModal implements OnInit {

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    ordinal: false,
    value: this.fb.nonNullable.control<string | number>('', { validators: Validators.required })
  });
  
  preloader = false;
  isRoot = false;

  @Input({ required: true })
  category!: Category;

  @Output()
  closes = new EventEmitter<Category | null>();

  constructor(
    private state: CategoriesState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.isRoot = Serial.isRoot(this.category.serial);
    this.form.controls.title.setValue(this.category.title);
    this.form.controls.ordinal.setValue(this.category.ordinal);
    this.form.controls.value.setValue(this.category.value);
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.update({ serial: this.category.serial }, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closes.emit(this.category);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
