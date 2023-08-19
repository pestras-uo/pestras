/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BlueprintsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Blueprint, DataStoreType, WorkspacePinType } from '@pestras/shared/data-model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styles: [`
    :host {
      height: var(--main-height);
      display: grid;
      grid-template-columns: auto 1fr;
    }

    main {
      height: 100%;
      overflow-y: auto;
    }
  `]
})
export class DetailsPage implements OnChanges {
  wsType = WorkspacePinType.BLUEPRINTS;
  dsType = DataStoreType

  view = 'details';
  dialogRef: DialogRef | null = null;
  preloader = false;

  bp$!: Observable<Blueprint | null>;

  readonly title = new FormControl('', { validators: Validators.required, nonNullable: true });

  @Input({ required: true })
  serial!: string;

  constructor(
    private state: BlueprintsState,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnChanges() {
    this.bp$ = this.state.select(this.serial)
      .pipe(tap(bp => this.title.setValue(bp?.name ?? '')));
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp)
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.title.reset();
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.update(this.serial, this.title.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
