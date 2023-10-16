/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { ContraService } from '@pestras/frontend/util/contra';
import { Dashboard, WorkspacePinType } from '@pestras/shared/data-model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BreadcrumbComponent } from 'libs/frontend/ui/src/lib/breadcrumb/breadcrumb.component';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'pestras-dashboard-details',
  templateUrl: './details.page.html',
  styles: [
    `
      :host {
        height: var(--main-height);
        display: grid;
        grid-template-columns: auto 1fr;
      }

      main {
        height: 100%;
        overflow-y: auto;
      }
    `,
  ],
})
export class DetailsPageComponent implements OnChanges {
  wsType = WorkspacePinType.DASHBOARDS;

  view = 'details';
  dialogRef: DialogRef | null = null;
  preloader = false;

  dashboard$!: Observable<Dashboard | null>;

  readonly title = new FormControl('', {
    validators: Validators.required,
    nonNullable: true,
  });

  @Input({ required: true })
  topic: string | null = null;
  @Input({ required: true })
  serial!: string;

  @Input()
  breadcrumbs: { label: string; link: string[] }[] = [];

  @Input()
  set menu(value: string) {
    this.view = value ?? 'details';
  }
  lastValueUrl = '';

  constructor(
    private state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private contra: ContraService
  ) {}

  ngOnChanges() {
    this.dashboard$ = this.state
      .select(this.serial)
      .pipe(tap((d) => this.title.setValue(d?.title ?? '')));

    //GET ID DASHBOARD FROM URL TO TEST
    this.route.url.subscribe((segments) => {
      // Extract before the last segment from the URL
      this.lastValueUrl = segments[segments.length - 2].path;

      console.log('Last segment value:', this.lastValueUrl);
    });

    //BreadCrumb logic :

    let link = ``;

    const c = this.contra.content();
    if (this.dashboard$) {
      this.dashboard$.subscribe((dashboard) => {
        if (dashboard) {
          //test from where I csame to dahsboard :

          console.log(this.topic);
          console.log(this.lastValueUrl);
          if (this.topic && this.topic === this.lastValueUrl) {
            link = `/main/topics/${this.topic}`;
            const breadcrumb = BreadcrumbComponent.breadCrumbFunc(
              c['topics'],
              dashboard['title'] as string,
              dashboard['serial'] as string,
              link,
              { menu: 'dashboards' }
            );
            this.breadcrumbs = breadcrumb;
          } else {
            link = `/main/dashboards`;

            const breadcrumb = BreadcrumbComponent.breadCrumbFunc(
              c['dashboards'],
              dashboard.title,
              this.serial,
              link,
              {}
            );
            this.breadcrumbs = breadcrumb;
          }
        }
      });
    }
  }

  set(menu: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { menu } });
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

  update(c: Record<string, any>, serial: string) {
    this.preloader = true;

    this.state.update(serial, this.title.value).subscribe({
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
