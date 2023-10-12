/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { ContraService } from '@pestras/frontend/util/contra';
import { Report, WorkspacePinType } from '@pestras/shared/data-model';
import { BreadcrumbComponent } from 'libs/frontend/ui/src/lib/breadcrumb/breadcrumb.component';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-details',
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
export class DetailsPage implements OnChanges {
  wsType = WorkspacePinType.REPORTS;
  view = 'details';
  preloader = false;
  dialogRef: DialogRef | null = null;

  report$!: Observable<Report | null>;

  readonly title = new FormControl('', {
    validators: Validators.required,
    nonNullable: true,
  });

  @Input({ required: true })
  topic!: string;
  @Input({ required: true })
  serial!: string;

  @Input()
  breadcrumbs: { label: string; link: string }[] = [];
  @Input()
  set menu(value: string) {
    this.view = value ?? 'details';
  }

  lastValueUrl = '';

  constructor(
    private state: ReportsState,
    private readonly toast: ToastService,
    private readonly dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private contra: ContraService
  ) {}

  ngOnChanges() {
    this.report$ = this.state
      .select(this.serial, this.topic)
      .pipe(tap((d) => this.title.setValue(d?.title ?? '')));

    //BreadCrumb logic :

    //GET ID DASHBOARD FROM URL TO TEST
    this.route.url.subscribe((segments) => {
      // Extract before the last segment from the URL
      this.lastValueUrl = segments[segments.length - 2].path;

      console.log('Last segment value:', this.lastValueUrl);
    });

    let link = ``;

    const c = this.contra.content();
    if (this.report$) {
      this.report$.subscribe((report) => {
        if (report) {
          //test from where I came to report :

          console.log(this.topic);
          console.log(this.lastValueUrl);
          if (this.topic && this.topic === this.lastValueUrl) {
            link = `/main/topics/${this.topic}`;
            const breadcrumb = BreadcrumbComponent.breadCrumbFunc(
              c['reports'],
              report.title as string,
              report.serial as string,
              link,
              { menu: 'reports' }
            );
            this.breadcrumbs = breadcrumb;
          } else {
            link = `/main/dashboards`;

            const breadcrumb = BreadcrumbComponent.breadCrumbFunc(
              c['dashboards'],
              report.title,
              report.serial,
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
