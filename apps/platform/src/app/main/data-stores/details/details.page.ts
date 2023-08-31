/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoresState } from '@pestras/frontend/state';
import { PubSubService, ToastService } from '@pestras/frontend/ui';
import { Blueprint, DataStore, DataStoreState, DataStoreType, Role } from '@pestras/shared/data-model';
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
export class DataStoreDetailsPage implements OnChanges {
  readonly roles = Role;

  view = 'details';
  dataStore$!: Observable<DataStore | null>;
  preloader = false;
  dialogRef: DialogRef | null = null;
  canBuild = false;

  @Input()
  set menu(value: string) {
    this.view = value ?? 'details';
  }

  readonly title = new FormControl('', { validators: Validators.required, nonNullable: true })

  @Input({ required: true })
  blueprint!: Blueprint;
  @Input({ required: true })
  serial!: string;

  constructor(
    private state: DataStoresState,
    private toast: ToastService,
    private dialog: Dialog,
    private pubSub: PubSubService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnChanges() {
    this.dataStore$ = this.state.select(this.serial, this.blueprint.serial)
      .pipe(tap(ds => this.canBuild = ds?.type !== DataStoreType.WEB_SERVICE && ds?.state === DataStoreState.BUILD));
  }

  set(menu: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { menu } });
  }

  pageBottomReached() {
    this.pubSub.pub('recordsList');
  }

  findType(input: { value: DataStoreType; name: string; }, type: DataStoreType) {
    return input.value === type;
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
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

  build(c: Record<string, any>) {
    this.preloader = true;

    this.state.build(this.serial)
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
