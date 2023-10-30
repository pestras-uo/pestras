/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { User } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-update-profile',
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit {
  readonly form = new FormGroup({
    fullname: new FormControl<string>('', {
      nonNullable: true, validators: [Validators.required]
    }),
    mobile: new FormControl<string>(''),
    email: new FormControl<string>('', { validators: [Validators.email] })
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
    this.form.controls.fullname.setValue(this.user.fullname);
    this.form.controls.mobile.setValue(this.user.mobile);
    this.form.controls.email.setValue(this.user.email);
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateProfile(this.user.serial, this.form.getRawValue())
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
