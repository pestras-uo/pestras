/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@pestras/frontend/ui';
import { TopicsState } from '@pestras/frontend/state';
import { AddTopicFormModel } from './form.model';
import { Blueprint } from '@pestras/shared/data-model';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.modal.html',
  styles: [
  ]
})
export class AddTopicModal {

  readonly form = new FormGroup<AddTopicFormModel>({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    blueprint: new FormControl<string>('', { nonNullable: true }),
    parent: new FormControl(null)
  });

  preloader = false;

  @Input({ required: true })
  parent!: string | null;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: TopicsState,
    private toast: ToastService
  ) {}

  mapBp(bp: Blueprint) {
    return { name: bp.name, value: bp.serial };
  }

  addTopic(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closes.emit();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
