/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Report, ReportSlide } from '@pestras/shared/data-model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss']
})
export class SideMenuView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required]
  });

  reorder = false;
  preloader = false;
  slides: ReportSlide[] = [];
  slidesOrder: string[] = [];
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  report!: Report;
  @Input({ required: true })
  view!: string;

  @Output()
  selects = new EventEmitter<string>();

  constructor(
    private state: ReportsState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService,
    protected loc: Location
  ) { }

  ngOnChanges(): void {
    this.slidesOrder = [...this.report.slides_order];
    this.slides = this.slidesOrder
      .map(o => this.report.slides.find(t => t.serial === o))
      .filter(Boolean) as ReportSlide[];
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevOrder = [...this.slidesOrder];
    moveItemInArray(this.slidesOrder, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== this.slidesOrder[i])) {
      this.slides = this.slidesOrder
        .map(o => this.report.slides.find(t => t.serial === o))
        .filter(Boolean) as ReportSlide[];
        
      this.updateOrder();
    }
  }

  updateOrder() {
    this.preloader = true;
    this.state.updateSlidesOrder(this.report.serial, this.report.slides_order)
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

  openDialog(tmp: TemplateRef<any>, slide?: ReportSlide) {
    if (slide)
      this.form.controls.title.setValue(slide.title);

    this.dialogRef = this.dialog.open(tmp, { data: slide });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.preloader = false;
    this.form.reset();
  }

  submit(c: Record<string, any>, serial?: string) {
    this.preloader = true;

    serial ? this.updateSlide(c, serial) : this.addSlide(c);
  }

  addSlide(c: Record<string, any>) {
    this.state.addSlide(this.report.serial, this.form.getRawValue())
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

  updateSlide(c: Record<string, any>, serial: string) {
    this.state.updateSlide(this.report.serial, serial, this.form.getRawValue())
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

  removeSlide(c: Record<string, any>, serial: string) {
    this.state.removeSlide(this.report.serial, serial)
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
