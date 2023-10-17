/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicsState } from '@pestras/frontend/state';
import { PubSubService, ToastService } from '@pestras/frontend/ui';
import { Topic, WorkspacePinType } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styles: [
    `
      :host {
        display: block;
        width: calc(100vw - 72px);
      }
      main {
        height: var(--main-height);
        overflow-y: auto;
      }
    `,
  ],
})
export class DetailsPage implements OnChanges {
  wsType = WorkspacePinType.TOPICS;
  view = 'details';
  dataStore: string | null = null;
  dialogRef: DialogRef | null = null;
  preloader = false;

  topic$!: Observable<Topic | null>;

 
  readonly title = new FormControl('', {
    validators: Validators.required,
    nonNullable: true,
  }); 

  @Input({ required: true })
  theme!: string;
  @Input({ required: true })
  serial!: string;
  @Input()
  set menu(value: string) {
    this.view = value ?? 'main';
  }
  @Input()
  set ds(value: string) {
    this.dataStore = value ?? '';
  }

  constructor(
    private state: TopicsState,
    private dialog: Dialog,
    private toast: ToastService,
    private pubSub: PubSubService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  set(menu: string, ds?: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { menu, ds: ds ?? '' }, replaceUrl: true });

    if (menu !== 'dataStores') this.dataStore = null;
  }

  ngOnChanges() {
    this.topic$ = this.state.select(this.serial, this.theme);
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

  pageBottomReached() {
    this.pubSub.pub('recordsList');
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.update(this.serial, this.title.value).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
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
