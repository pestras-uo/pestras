/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  Workspace,
  WorkspaceGroup,
  WorkspacePin,
  WorkspacePinType,
} from '@pestras/shared/data-model';
import { WorkspaceState } from '@pestras/frontend/state';

@Component({
  selector: 'app-pins',
  templateUrl: './pins.view.html',
  styles: [
    `
      :host {
        display: block;
        width: 240px;
        padding: 32px;
        height: 100%;
        border-inline-end: 1px solid var(--border1);
        overflow: auto;
      }

      /* Landscape */
      @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
        /* Your styles for portrait orientation go here */
        :host {
          width: 180px;
        }
      }

      /* Portrait */
      @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
        /* Your styles for portrait orientation go here */
        :host {
          width: 180px;
        }
      }

      .toolbar,
      .card-header {
        min-height: 24px;
      }

      .actions-on-hover button {
        display: none;
      }

      .actions-on-hover:hover button {
        display: inline-block;
      }
    `,
  ],
})
export class PinsView implements OnChanges {
  readonly groupName = new FormControl('', {
    validators: Validators.required,
    nonNullable: true,
  });

  dialogRef: DialogRef | null = null;
  preloader = true;

  groups: (WorkspaceGroup & {
    dataStores: WorkspacePin[];
    blueprints: WorkspacePin[];
    topics: WorkspacePin[];
    dashboards: WorkspacePin[];
    reports: WorkspacePin[];
  })[] = [];

  @Input({ required: true })
  ws!: Workspace;

  constructor(private state: WorkspaceState, private dialog: Dialog) {}

  ngOnChanges(): void {
    this.groups = this.ws.groups.map((g) => {
      return {
        ...g,
        dataStores: this.ws.pins.filter(
          (p) => p.group === g.serial && p.type === WorkspacePinType.DATA_STORES
        ),
        blueprints: this.ws.pins.filter(
          (p) => p.group === g.serial && p.type === WorkspacePinType.BLUEPRINTS
        ),
        topics: this.ws.pins.filter(
          (p) => p.group === g.serial && p.type === WorkspacePinType.TOPICS
        ),
        dashboards: this.ws.pins.filter(
          (p) => p.group === g.serial && p.type === WorkspacePinType.DASHBOARDS
        ),
        reports: this.ws.pins.filter(
          (p) => p.group === g.serial && p.type === WorkspacePinType.REPORTS
        ),
      };
    });
  }

  openDialog(tmp: TemplateRef<any>, serial?: string, name?: string) {
    if (name) this.groupName.setValue(name);

    this.dialogRef = this.dialog.open(tmp, { data: serial });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.groupName.reset();
    this.preloader = false;
  }

  addGroup() {
    this.preloader = true;

    this.state.addGroup(this.groupName.value).subscribe({
      next: () => this.closeDialog(),
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }

  updateGroup(serial: string) {
    this.preloader = true;

    this.state.updateGroup(serial, this.groupName.value).subscribe({
      next: () => this.closeDialog(),
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }

  removeGroup(serial: string) {
    this.preloader = true;

    this.state.removeGroup(serial).subscribe({
      next: () => this.closeDialog(),
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }

  removePin(serial: string) {
    this.preloader = true;

    this.state.removePin(serial).subscribe({
      next: () => this.closeDialog(),
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }
}
