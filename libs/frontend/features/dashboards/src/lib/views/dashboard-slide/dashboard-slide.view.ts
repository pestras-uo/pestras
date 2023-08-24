/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Dashboard, DashboardSlide, DashboardSlideView, DashboardViewSize } from '@pestras/shared/data-model';
import { ToastService, PuiSideDrawer } from '@pestras/frontend/ui';
import { DashboardsState } from '@pestras/frontend/state';

@Component({
  selector: 'app-dashboard-slide',
  templateUrl: './dashboard-slide.view.html',
  styleUrls: ['./dashboard-slide.view.scss']
})
export class DashboardSlideComponent implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slide:'',
    data_viz: '',
    size: this.fb.nonNullable.group({
      x: this.fb.nonNullable.control<DashboardViewSize['x']>(4),
      y: this.fb.nonNullable.control<DashboardViewSize['y']>(1)
    }),
    mode: this.fb.nonNullable.control<'light' | 'dark'>('light', Validators.required),
  });

  dialogRef: DialogRef | null = null;
  preloader = false;
  reorder = false;
  slide!: DashboardSlide | null;
  views: DashboardSlideView[] = [];
  editingView: string | null = null;
  fullscreen = false;
  viewsOrder: string[] = []

  @Input({ required: true })
  dashboard!: Dashboard;
  @Input({ required: true })
  slideSerial!: string;
  @Input({ required: true })
  topic!: string;
  @Input()
  headless = false;
  @Input()
  editable = false;

  constructor(
    private state: DashboardsState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private sideDrawer: PuiSideDrawer,
    private toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.slide = this.dashboard.slides.find(t => t.serial === this.slideSerial) ?? null;

    if (this.slide) {
      this.viewsOrder = [...this.slide.views_order];

      this.views = this.viewsOrder
        .map(o => this.dashboard.views.find(v => v.serial === o))
        .filter(Boolean) as DashboardSlideView[];
    }
  }

  async toggleFullScreen(elem: HTMLElement) {
    if (!this.fullscreen) {
      if (elem.requestFullscreen)
        await elem.requestFullscreen()
          .then(() => this.fullscreen = true);

    } else {
      await document.exitFullscreen()
        .then(() => this.fullscreen = false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openDialog(tmp: TemplateRef<any>, view?: DashboardSlideView) {
    if (view) {
      this.form.controls.title.setValue(view.title);
      this.form.controls.size.setValue(view.size);
      this.form.controls.mode.setValue(view.mode);
    }

    this.dialogRef = this.dialog.open(tmp, { data: view });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.preloader = false;
    this.form.reset();
  }

  trackBySerial(_: number, view: DashboardSlideView) {
    return view.serial;
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevOrder = [...this.viewsOrder];
    moveItemInArray(this.viewsOrder, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== this.viewsOrder[i])) {
      this.views = this.viewsOrder
        .map(o => this.dashboard.views.find(v => v.serial === o))
        .filter(Boolean) as DashboardSlideView[];
        
      this.updateOrder()
    }
  }

  updateOrder() {
    this.preloader = true;

    this.state.updateViewsOrder(this.dashboard.serial, this.slideSerial, this.viewsOrder)
      .subscribe({
        next: () => {
          this.preloader = false;
        },
        error: e => {
          console.error(e);
          this.preloader = false;
        }
      });
  }

  addView(c: Record<string, any>) {
    this.preloader = true;

    this.form.controls.slide.setValue(this.slideSerial);

    this.state.addView(this.dashboard.serial, this.form.getRawValue())
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

  updateView(c: Record<string, any>, serial: string) {
    this.preloader = true;

    const data = this.form.getRawValue();

    this.state.updateView(this.dashboard.serial, serial, {
      title: data.title,
      size: data.size,
      mode: data.mode
    })
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

  removeView(c: Record<string, any>, serial: string) {
    this.preloader = true;

    this.state.removeView(this.dashboard.serial, serial)
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

  openSideDrawer(tmp: TemplateRef<any>, view: string) {
    this.editingView = view;
    this.sideDrawer.attach(tmp);
  }

  closeDrawer(c: Record<string, any>, serial: string | null) {
    this.sideDrawer.close();

    if (!serial || !this.editingView)
      return;

    this.preloader = true;

    this.state.setViewDataViz(this.dashboard.serial, this.editingView, serial)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.editingView = null;
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.editingView = null;
          this.preloader = false;
        }
      })
  }
}
