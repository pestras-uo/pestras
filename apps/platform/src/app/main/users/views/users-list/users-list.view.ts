/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Output, EventEmitter, TemplateRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersState, SessionState } from '@pestras/frontend/state';
import { startWith, debounceTime, switchMap, map, tap } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { User } from '@pestras/shared/data-model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.view.html',
  styleUrls: ['./users-list.view.scss']
})
export class UsersListView {
  protected readonly searchControl = new FormControl('');

  private dialofRef: DialogRef | null = null;

  readonly users$ = this.searchControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(300),
      switchMap(search => this.state.selectMany(u => !search || u.fullname.includes(search))),
      map(list => list.sort((a, b) => {
        const l1 = this.session.getTopRole(a.roles);
        const l2 = this.session.getTopRole(b.roles);

        return l1 !== l2
          ? l1 - l2
          : a.fullname < b.fullname ? -1 : 1
      })),
      tap(list => this.selected || (list.length > 0 && this.selects.next(list[0].serial)))
    );

  @Input({ required: true })
  selected!: string;

  @Output()
  readonly selects = new EventEmitter<string>();

  constructor(
    private session: SessionState,
    private state: UsersState,
    private readonly dialog: Dialog
  ) { }

  filterUser = (user: User) => {
    return this.session.isAdminOverUser(user);
  }

  openModal(ref: TemplateRef<any>) {
    this.dialofRef = this.dialog.open(ref);
  }

  closeModal(serial?: string) {
    if (serial)
      this.selects.emit(serial);

    !!this.dialofRef && this.dialofRef.close();
  }
}
