/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { User } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-update-password',
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {
  readonly form = new FormGroup({
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\-.]{4,64}$/), Validators.minLength(5)]
    })
  });

  preloader = false;

  @Input({ required: true })
  user!: User;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: UsersState,
    private toast: ToastService
  ) { }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.updatePassword(this.user.serial, this.form.getRawValue().password)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].userAdd, { type: 'success' });
          this.closes.emit()
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
