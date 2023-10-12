/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Blueprint, ClientApi } from '@pestras/shared/data-model';
import { ClientApiState } from '@pestras/frontend/state';
import { ContraService } from '@pestras/frontend/util/contra';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BreadcrumbComponent } from 'libs/frontend/ui/src/lib/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-clients-api',
  templateUrl: './clients-api.page.html',
  styles: [
    `
      :host {
        height: var(--main-height);
        overflow-y: auto;
      }

      header {
        padding-block: 48px;
        border-block-end: 1px solid var(--border1);
      }

      main {
        padding-block: 32px;
      }
    `,
  ],
})
export class ClientsApiPage implements OnChanges {
  client$!: Observable<ClientApi | null>;
  preloader = false;
  dialogRef?: DialogRef;

  @Input({ required: true })
  blueprint!: Blueprint;
  @Input({ required: true })
  serial!: string;

  @Input()
  breadcrumbs: { label: string; link: string }[] = [];

  constructor(
    private state: ClientApiState,
    private dialog: Dialog,
    private contra: ContraService
  ) {}

  ngOnChanges() {
    this.client$ = this.state.select(this.serial);

    let link = ``;

    const c = this.contra.content();
    if (this.client$) {
      this.client$.subscribe((client) => {
        link = `/main/blueprints/${this.blueprint.serial}`;

        if (client) {
          const breadcrumb = BreadcrumbComponent.breadCrumbFunc(
            c['clientName'],
            client.client_name,
            this.blueprint.serial,
            link,
            { menu: 'export' }
          );
          this.breadcrumbs = breadcrumb;
        }
      });
    }
  }

  openModal(modal: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(modal);
  }

  closeModal() {
    !!this.dialogRef && this.dialogRef.close();
    this.preloader = false;
  }

  update(c: Record<string, any>, value: string) {
    this.preloader = true;

    this.state.update(this.serial, value).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (e) => {
        console.error(e);
        this.closeModal();
      },
    });
  }

  removeIp(c: Record<string, any>, ip: string) {
    this.state.removeIP(this.serial, ip).subscribe({
      error: (e) => {
        console.error(e);
      },
    });
  }

  addIp(c: Record<string, any>, value: string) {
    this.preloader = true;

    this.state.addIP(this.serial, value).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (e) => {
        console.error(e);
        this.closeModal();
      },
    });
  }
}
