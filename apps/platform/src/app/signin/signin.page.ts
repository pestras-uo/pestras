/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PuiCheckInput, PuiIcon, PuiPreloaderModule, ToastService } from '@pestras/frontend/ui';
import { SessionState } from '@pestras/frontend/state';
import { CommonModule } from '@angular/common';
import { ContraModule } from '@pestras/frontend/util/contra';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContraModule, PuiIcon, PuiPreloaderModule, PuiCheckInput],
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SigninPage {
  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    remember: [false]
  });

  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly session: SessionState,
    private readonly router: Router,
    private readonly toast: ToastService
  ) { }

  login(c: Record<string, any>) {
    this.isLoading = true;

    this.session.login(this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.router.navigate(['main/workspace']);
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
          this.toast.msg(c['errors'][err.error] || c['errors'].default, { type: 'error'});
        }
      });
  }

  guestLogin(c: Record<string, any>) {
    this.isLoading = true;

    this.session.login({ username: 'Guest', password: 'Guest' })
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.router.navigate(['main/workspace']);
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
          this.toast.msg(c['errors'][err.error] || c['errors'].default, { type: 'error'});
        }
      });
  }
}
