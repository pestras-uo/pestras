/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, TemplateRef } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastService, FormValidators } from '@pestras/frontend/ui';
import { tap, Observable } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styles: [`
    :host {
      display: block;
      height: var(--main-height);
      overflow: auto;
    }
  `]
})
export class ProfilePage {

  private dialogRef: DialogRef | null = null;

  readonly avatarControl = new FormControl<File | null>(null);
  readonly usernameControl = new FormControl("", { validators: [Validators.required], nonNullable: true });
  readonly personalForm = this.fb.nonNullable.group({
    fullname: ['', Validators.required],
    email: ['', Validators.email],
    mobile: ['']
  });
  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  updatePasswordForm = false;
  preloader = false;
  user$ = this.state.data$
    .pipe(tap(user => {
      if (!user)
        return;
      
      this.usernameControl.setValue(user.username);
      this.usernameControl.setValidators([Validators.required, FormValidators.changed(user.username)]);

      this.personalForm.controls.fullname.setValue(user.fullname);
      this.personalForm.controls.email.setValue(user.email || '');
      this.personalForm.controls.mobile.setValue(user.mobile || '');
      this.personalForm.setValidators(FormValidators.changed({
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile
      }));
    }));

  constructor(
    private state: SessionState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  openModal(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
      this.avatarControl.reset();
    }
  }

  updateAvatar(c: Record<string, any>) {
    this.preloader = true;

    const avatar = this.avatarControl.value;
    const req: Observable<any> = avatar
      ? this.state.updateAvater({ avatar })
      : this.state.deleteAvatar();

    req.subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.closeModal()
        this.preloader = false;
      },
      error: e => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
        this.preloader = false;
      }
    });
  }

  updateUsername(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateUsername({ username: this.usernameControl.value })
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  updatePersonalInfo(c: Record<string, any>) {
    this.preloader = true;

    this.state.updateProfile(this.personalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  updatePassword(c: Record<string, any>) {
    this.preloader = true;

    this.state.updatePassword(this.passwordForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
