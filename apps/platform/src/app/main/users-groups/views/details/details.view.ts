/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User, UsersGroup } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { UsersGroupsState, UsersState } from '@pestras/frontend/state';
import { Observable, tap, filter } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.view.html',
  styleUrls: ['./details.view.scss'],
})
export class DetailsView implements OnChanges {
  readonly name = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });
  readonly user = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  group$!: Observable<UsersGroup | null>;

  dialogRef: DialogRef | null = null;
  preloader = false;

  @Input({ required: true })
  serial!: string;

  constructor(
    private readonly state: UsersGroupsState,
    private readonly usersState: UsersState,
    private readonly dialog: Dialog,
    private readonly toast: ToastService
  ) {}

  ngOnChanges() {
    this.group$ = this.state.select(this.serial).pipe(
      filter(Boolean),
      tap((g) => this.name.setValue(g.name))
    );
  }

  openDialog(ref: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(ref);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.user.reset();
  }

  filterUsers(user: User, group: string) {
    return user.groups.includes(group);
  }

  filterSelectUsers(user: User, group: string) {
    return !user.groups.includes(group);
  }

  mapUserSelect(user: User) {
    return { name: user.fullname, value: user.serial };
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.update(this.serial, this.name.value).subscribe({
      next: () => {
        this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
        this.closeDialog();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.preloader = false;
      },
    });
  }

  addUser(c: Record<string, any>) {
    this.preloader = true;

    this.usersState.addGroup(this.user.value, this.serial).subscribe({
      next: () => {
        this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
        this.closeDialog();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.preloader = false;
      },
    });
  }

  removeUser(c: Record<string, any>, serial: string) {
    this.usersState.removeGroup(serial, this.serial).subscribe({
      next: () => {
        this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
        this.closeDialog();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.preloader = false;
      },
    });
  }
}
