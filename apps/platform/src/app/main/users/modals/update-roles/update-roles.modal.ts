/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role, User } from '@pestras/shared/data-model';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { SessionState, UsersState } from '@pestras/frontend/state';

@Component({
  selector: 'app-update-roles',
  templateUrl: './update-roles.modal.html',
  styles: [
  ]
})
export class UpdateRolesModal implements OnInit {
  readonly ud = untilDestroyed();
  readonly form = new FormGroup({
    roles: new FormControl<Role[]>([], { nonNullable: true, validators: Validators.required }),
    is_super: new FormControl(false, { nonNullable: true })
  });

  preloader = false;
  roles!: { name: Role; value: Role; }[];
  enableIsSuper = false;

  @Input({ required: true })
  user!: User;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: UsersState,
    private session: SessionState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const session = this.session.get();
    let roles: Role[] = [Role.ADMIN, Role.DATA_ENG, Role.REPORTER, Role.AUTHOR, Role.GUEST];

    if (this.user.orgunit === this.session.get()?.orgunit && !session?.is_super)
      roles = roles.slice(1);

    this.roles = roles.map(r => ({ name: r, value: r }));

    this.form.controls.roles.setValue(this.user.roles);
    this.form.controls.is_super.setValue(this.user.is_super);

    this.form.controls.roles.valueChanges
      .pipe(this.ud())
      .subscribe(roles => {
        if (this.user.orgunit === this.session.get()?.orgunit || !roles.includes(Role.ADMIN)) {
          this.enableIsSuper = false;
          this.form.controls.is_super.setValue(false);
        } else
          this.enableIsSuper = true;
      });
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    const { roles, is_super } = this.form.getRawValue();

    this.state.updateRoles(this.user.serial, roles, is_super)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].userAdd, { type: 'success' });
          this.closes.emit(this.user.serial)
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
