/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { Orgunit, Role, User } from '@pestras/shared/data-model';
import { OrgunitsState, UsersState, SessionState } from '@pestras/frontend/state';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.view.html',
  styleUrls: ['./user-details.view.scss']
})
export class UserDetailsView implements OnChanges {
  private dialogRef: DialogRef | null = null;

  user$!: Observable<User | null>;
  orgunit$!: Observable<Orgunit | null>;
  canUpdate = false;
  preloader = false;
  actsPeriod = 'week';

  @Input({ required: true })
  serial!: string;

  constructor(
    private readonly state: UsersState,
    private readonly session: SessionState,
    private readonly orgunitsState: OrgunitsState,
    private readonly dialog: Dialog
  ) { }

  ngOnChanges(): void {
    this.user$ = this.state.select(this.serial)
      .pipe(tap(user => {
        if (!user)
          return;

        const session = this.session.get();
        if (!session)
          return;

        this.canUpdate = Serial.isBranch(user.orgunit, session.orgunit, !user.roles.includes(Role.ADMIN) || session.is_super);
      }))

    this.orgunit$ = this.user$
      .pipe(
        filter(Boolean),
        switchMap(u => this.orgunitsState.select(u.orgunit))
      );
  }

  openModal(ref: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
