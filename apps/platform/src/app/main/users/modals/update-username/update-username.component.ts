/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { User } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-update-username',
  templateUrl: './update-username.component.html',
})
export class UpdateUsernameComponent implements OnInit {

  readonly form = new FormGroup({
    username: new FormControl<string>('', {
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

  ngOnInit(): void {
    this.form.controls.username.setValue(this.user.username);
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateUsername(this.user.serial, this.form.getRawValue().username)
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
