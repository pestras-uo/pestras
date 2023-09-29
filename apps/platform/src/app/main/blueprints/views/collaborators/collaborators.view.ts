import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, TemplateRef } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { BlueprintsState } from "@pestras/frontend/state";
import { ToastService } from "@pestras/frontend/ui";
import { Blueprint, User } from "@pestras/shared/data-model";

@Component({
  selector: 'pestras-blueprint-collaborators',
  templateUrl: './collaborators.view.html'
})
export class CollaboratorsViewComponent {

  readonly usersCtrl = new FormControl('', { nonNullable: true, validators: Validators.required });

  dialogRef: DialogRef | null = null;
  loading = false;

  @Input({ required: true })
  blueprint!: Blueprint;
  @Input()
  editable = false;

  constructor(
    private state: BlueprintsState,
    private dialog: Dialog,
    private taost: ToastService
  ) {}

  filterUsers = (user: User) => {
    return !this.blueprint.collaborators.includes(user.serial) && user.serial !== this.blueprint.owner;
  }

  mapUser(user: User) {
    return { name: user.fullname, value: user.serial };
  }

  openDialog(tmp: TemplateRef<unknown>, serial?: string) {
    this.dialogRef = this.dialog.open(tmp, { data: serial });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.loading = false;
    this.usersCtrl.reset();
  }

  add(successMsg: string, errorMsgs: Record<string, string>) {
    this.loading = true;

    this.state.addCollaborator(this.blueprint.serial, this.usersCtrl.value)
      .subscribe({
        next: () => {
          this.taost.msg(successMsg, { type: 'success' });
          this.closeDialog();
        },
        error: error => {
          console.error(error);
          this.taost.msg(errorMsgs[error.message || 'defau;lt']);
          this.loading = false;
        }
      });
  }

  remove(serial: string, successMsg: string, errorMsgs: Record<string, string>) {
    this.loading = true;

    this.state.removeCollaborator(this.blueprint.serial, serial)
      .subscribe({
        next: () => {
          this.taost.msg(successMsg, { type: 'success' });
          this.closeDialog();
        },
        error: error => {
          console.error(error);
          this.taost.msg(errorMsgs[error.message || 'defau;lt']);
          this.loading = false;
        }
      });
  }
}