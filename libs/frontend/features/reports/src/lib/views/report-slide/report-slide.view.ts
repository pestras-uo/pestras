/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  DataRecord,
  DataStore,
  Report,
  ReportSlide,
  ReportView,
  ReportViewType,
} from '@pestras/shared/data-model';
import { ToastService, PuiSideDrawer } from '@pestras/frontend/ui';
import { RecordsService, ReportsState } from '@pestras/frontend/state';
import { Observable, filter, forkJoin, map, take } from 'rxjs';

@Component({
  selector: 'app-report-slide',
  templateUrl: './report-slide.view.html',
  styleUrls: ['./report-slide.view.scss'],
})
export class ReportSlideView implements OnChanges {
  @ViewChild('content') content!: ElementRef;

  readonly form = this.fb.nonNullable.group({
    title: '',
    slide: '',
    sub_title: '',
    type: this.fb.nonNullable.control<ReportViewType>(
      ReportViewType.RICH_TEXT,
      Validators.required
    ),
    content: '',
  });

  data$!: Observable<{ data_store: DataStore; records: DataRecord[] }>;

  slide!: ReportSlide | null;
  views: ReportView[] = [];
  viewsOrder: string[] = [];
  reorder = false;
  editMode = false;
  pdfMode = false;
  dialogRef: DialogRef | null = null;
  preloader = false;
  editingView: string | null = null;
  imageControl = new FormControl<File | null>(null, {
    validators: Validators.required,
    nonNullable: true,
  });
  contentControl = new FormControl<string>('', {
    validators: Validators.required,
    nonNullable: true,
  });

  @Input({ required: true })
  report!: Report;
  @Input({ required: true })
  slideSerial!: string;
  @Input()
  editable = false;

  constructor(
    private readonly state: ReportsState,
    private readonly dialog: Dialog,
    private readonly sideDrawer: PuiSideDrawer,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly recordService: RecordsService
  ) { }

  ngOnChanges(): void {
    this.slide = this.report.slides.find((s) => s.serial === this.slideSerial) ?? null;
    
    if (this.slide) {
      this.viewsOrder = [...this.slide.views_order];
      this.views = this.viewsOrder
        .map((o) => this.report.views.find((v) => v.serial === o))
        .filter(Boolean) as ReportView[];
    }

    this.data$ = forkJoin([
      this.state
        .select(this.slide?.data_store ?? '')
        .pipe(filter(Boolean), take(1)),
      this.recordService
        .search({ ds: this.slide?.data_store ?? '' }, { limit: 0 })
        .pipe(
          filter(Boolean),
          map((res) => res.results),
          take(1)
        ),
    ]).pipe(
      map((data: any) => {
        return {
          data_store: data[0],
          records: data[1],
        };
      })
    );
  }

  openDialog(tmp: TemplateRef<any>, view?: ReportView) {
    if (view) {
      if (
        view.type === ReportViewType.RICH_TEXT ||
        view.type === ReportViewType.VIDEO
      )
        this.contentControl.setValue(view.content);

      this.form.controls.title.setValue(view.title || '');
      this.form.controls.sub_title.setValue(view.sub_title || '');
      this.form.controls.type.setValue(view.type);
      this.form.controls.content.setValue(view.content || '');
    }

    this.dialogRef = this.dialog.open(tmp, { data: view });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.form.reset();
    this.contentControl.reset();
    this.preloader = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevOrder = [...this.viewsOrder];
    moveItemInArray(this.viewsOrder, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== this.viewsOrder[i])) {
      this.views = this.viewsOrder
        .map((o) => this.report.views.find((v) => v.serial === o))
        .filter(Boolean) as ReportView[];

      this.updateOrder();
    }
  }

  updateOrder() {
    this.preloader = true;

    this.state
      .updateViewsOrder(this.report.serial, this.slideSerial, this.viewsOrder)
      .subscribe({
        next: () => {
          this.preloader = false;
        },
        error: (e) => {
          console.error(e);
          this.preloader = false;
        },
      });
  }

  submitView(c: Record<string, any>, view: string) {
    if (!this.slide) return;

    this.preloader = true;

    this.form.controls.slide.setValue(this.slide.serial);

    const req: Observable<any> = view
      ? this.state.updateView(this.report.serial, view, this.form.getRawValue())
      : this.state.addView(this.report.serial, this.form.getRawValue());

    req.subscribe({
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

  addImage(c: Record<string, any>, view: string) {
    if (!this.imageControl.value) return;

    this.preloader = true;

    this.state
      .updateViewImage(this.report.serial, view, this.imageControl.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
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

  updateContent(c: Record<string, any>, view: string) {
    this.preloader = true;

    this.state
      .updateViewContent(this.report.serial, view, this.contentControl.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.preloader = false;
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

  openSideDrawer(tmp: TemplateRef<any>, view: string) {
    this.editingView = view;
    this.sideDrawer.attach(tmp);
  }

  closeDrawer(c: Record<string, any>, serial: string | null) {
    this.sideDrawer.close();

    if (!serial || !this.editingView) return;

    this.preloader = true;

    this.state
      .updateViewContent(this.report.serial, this.editingView, serial)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.editingView = null;
          this.preloader = false;
        },
        error: (e) => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
            type: 'error',
          });
          this.editingView = null;
          this.preloader = false;
        },
      });
  }

  deleteView(c: Record<string, any>, serial: string) {
    this.preloader = true;

    this.state.removeView(this.report.serial, serial).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.closeDialog();
        this.preloader = false;
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.closeDialog();
        this.preloader = false;
      },
    });
  }
}
