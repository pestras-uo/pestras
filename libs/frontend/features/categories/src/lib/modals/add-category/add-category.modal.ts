/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { CategoriesService } from '@pestras/frontend/state';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.modal.html'
})
export class AddCategoryModal implements OnInit {
  readonly form = this.fb.nonNullable.group({
    blueprint: '',
    title: ['', [Validators.required, Validators.minLength(3)]],
    ordinal: false,
    value: this.fb.nonNullable.control<string | number>(''),
    parent: this.fb.control('')
  });

  readonly ordinal = this.form.controls.ordinal;

  preloader = false;

  @Input({ required: true })
  bp!: string;
  @Input()
  parent?: Category;

  @Output()
  closes = new EventEmitter<Category | null>();

  constructor(
    private service: CategoriesService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    if (this.parent)
      this.form.controls.ordinal.setValue(this.parent.ordinal);
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();

    data.blueprint = this.bp;
    data.parent = this.parent?.serial ?? null;
    data.value = (this.ordinal.value && this.parent) ? +data.value : data.title;

    this.service.create(data)
      .subscribe({
        next: cat => {
          this.toast.msg(c['success'].categoryAdd, { type: 'success' });
          this.closes.emit(cat);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
