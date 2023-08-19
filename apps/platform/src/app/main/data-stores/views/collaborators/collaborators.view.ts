/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { DataStore } from '@pestras/shared/data-model';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { DataStoresState, UsersState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.view.html',
  styles: [`
    .users-list {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(240px, 320px);
      gap: 32px;
    }
  `]
})
export class CollaboratorsView implements OnChanges {

  collaborators: string[] = [];
  userToRemove: string | null = null;
  userToAdd = new FormControl('', { validators: Validators.required, nonNullable: true });
  preloader = false;

  private dialogRef: DialogRef | null = null;

  users$ = this.usersState.data$
    .pipe(map(list => list.map(u => ({ name: u.fullname, value: u.serial }))));

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private usersState: UsersState,
    private dialog: Dialog,
    private toast: ToastService
  ) {}

  ngOnChanges(): void {
    this.collaborators = this.dataStore.collaborators;
  }

  openModal(ref: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
      this.userToRemove = null;
      this.userToAdd.reset();
    }
  }

  removeUser(c: Record<string, any>) {
    if (!this.userToRemove)
      return;

    this.preloader = false;

    this.state.removeCollaborator(this.dataStore.serial, this.userToRemove)
      .subscribe({
        next: () => {
          this.preloader = false;
          this.userToRemove = null;
          this.closeModal();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.closeModal();
          this.preloader = false;
        }
      });
  }

  addUser(c: Record<string, any>) {
    this.preloader = false;

    this.state.addCollaborator(this.dataStore.serial, this.userToAdd.value)
      .subscribe({
        next: () => {
          this.preloader = false;
          this.userToAdd.reset();
          this.closeModal();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.closeModal();
          this.preloader = false;
        }
      });
  }
}
