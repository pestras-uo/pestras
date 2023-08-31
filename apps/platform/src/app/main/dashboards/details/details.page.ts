/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Dashboard, WorkspacePinType } from '@pestras/shared/data-model';
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
  wsType = WorkspacePinType.DASHBOARDS

  view = 'details';
  dialogRef: DialogRef | null = null;
  preloader = false;

  dashboard$!: Observable<Dashboard | null>;

  readonly title = new FormControl('', { validators: Validators.required, nonNullable: true });

  @Input({ required: true })
  topic!: string;
  @Input({ required: true })
  serial!: string;
  @Input()
  set menu(value: string) {
    this.view = value ?? 'details';
  }

  constructor(
    private state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnChanges() {
    this.dashboard$ = this.state.select(this.serial, this.topic)
      .pipe(tap(d => this.title.setValue(d?.title ?? '')));
  }

  set(menu: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { menu } });
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;

    this.title.reset();
  }

  update(c: Record<string, any>, serial: string) {
    this.preloader = true;

    this.state.update(serial, this.title.value)
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
