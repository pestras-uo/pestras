/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { WorkspaceState } from '@pestras/frontend/state';
import { Workspace, WorkspaceGroup, WorkspacePin } from '@pestras/shared/data-model';
import { Observable, tap } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-workspace-toggle-pin',
  templateUrl: './workspace-toggle-pin.view.html'
})
export class WorkspaceTogglePinView implements OnChanges {
  ws$!: Observable<Workspace | null>;

  pinned = false;
  dialogRef: DialogRef | null = null;
  disabled = false;
  preloader = false;

  readonly group = new FormControl('', { nonNullable: true, validators: Validators.required });

  @Input({ required: true })
  input!: Omit<WorkspacePin, 'group'>;

  constructor(
    private state: WorkspaceState,
    private dialog: Dialog
  ) { }

  ngOnChanges(): void {
    this.ws$ = this.state.select()
      .pipe(tap(ws => {
        if (ws)
          this.pinned = !!ws.pins.find(p => p.serial === this.input.serial);
      }));
  }

  mapGroup(group: WorkspaceGroup) {
    return { name: group.name, value: group.serial };
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp)
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.group.reset();
  }

  pin(group: string) {
    this.preloader = true;

    this.state.addPin({ ...this.input, group })
      .subscribe({
        next: () => this.closeDialog(),
        error: e => {
          console.error(e);
          this.preloader = true;
        }
      })
  }

  unpin() {
    this.disabled = true;

    this.state.removePin(this.input.serial)
      .subscribe({
        next: () => this.disabled = false,
        error: e => {
          console.error(e);
          this.disabled = false;
        }
      })
  }
}
