/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Role } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { OrgunitsState, SessionState, UsersState } from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.modal.html'
})
export class AddUserModal implements OnInit {
  readonly ud = untilDestroyed();
  readonly form = this.fb.nonNullable.group({
    orgunit: ['', Validators.required],
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\-.]{4,64}$/), Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*-_=+.|<>:;'"()]{8,64}$/)]],
    roles: [[Role.GUEST], Validators.required],
    is_super: false,
    fullname: ['', [Validators.required]],
    email: ['', Validators.email],
    mobile: ['']
  });

  // form data
  readonly orgs$ = this.orgs.data$
    .pipe(
      map(list => list.filter(org => Serial.isBranch(org.serial, this.session.get()?.orgunit ?? '', true))),
      map(list => list.map(o => ({ name: o.name, value: o.serial }))),
      tap(list => this.form.controls.orgunit.setValue(list[0].value))
    );

  roles: { name: Role; value: Role}[] = [];
  enableIsSuper = false;
  preloader = false;

  @Output()
  closes = new EventEmitter();

  constructor(
    private session: SessionState,
    private state: UsersState,
    private orgs: OrgunitsState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.form.controls.orgunit.valueChanges
      .pipe(
        this.ud(),
        startWith('')
      )
      .subscribe(org => {
        if (org === this.session.get()?.serial) {
          if (this.session.get()?.is_super)
            this.roles = [Role.ADMIN, Role.DATA_ENG, Role.REPORTER, Role.AUTHOR, Role.GUEST].map(r => {
              return { name: r, value: r };
            });
          else {
            this.roles = [Role.DATA_ENG, Role.REPORTER, Role.AUTHOR, Role.GUEST].map(r => {
              return { name: r, value: r };
            });
            this.form.controls.roles.setValue(this.form.controls.roles.value.filter(r => r === Role.ADMIN));
          }

        } else
          this.roles = [Role.ADMIN, Role.DATA_ENG, Role.REPORTER, Role.AUTHOR, Role.GUEST].map(r => {
            return { name: r, value: r };
          });
      });

    combineLatest([
      this.form.controls.orgunit.valueChanges,
      this.form.controls.roles.valueChanges
    ])
      .pipe(this.ud())
      .subscribe(([org, roles]) => {
        if (org === this.session.get()?.orgunit || !roles.includes(Role.ADMIN)) {
          this.enableIsSuper = false;
          this.form.controls.is_super.setValue(false);
        } else
          this.enableIsSuper = true;
      });
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.form.getRawValue())
      .subscribe({
        next: u => {
          this.toast.msg(c['success'].userAdd, { type: 'success' });
          this.closes.emit(u.serial)
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
