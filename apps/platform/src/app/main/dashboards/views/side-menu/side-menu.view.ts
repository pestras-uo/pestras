/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  TemplateRef,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Dashboard, DashboardSlide } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-dashboard-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss'],
})
export class SideMenuViewComponent implements OnChanges {
  private playTimer: any = null;
  private currentSlideIndex = 0;

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    play_time: [1, Validators.required],
    data_store: ['', Validators.required],
  });

  playing = false;
  reorder = false;
  preloader = false;
  slides: DashboardSlide[] = [];
  slidesOrder: string[] = [];
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  dashboard!: Dashboard;
  @Input({ required: true })
  view!: string;

  @Input()
  fcClass = '';
  @Input()
  blueprint: string | null = null;

  @Output()
  selects = new EventEmitter<string>();

  constructor(
    private state: DashboardsState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService,
    protected loc: Location
  ) {}

  ngOnChanges(): void {
    this.slidesOrder = [...this.dashboard.slides_order];
    this.slides = this.slidesOrder
      .map((o) => this.dashboard.slides.find((t) => t.serial === o))
      .filter(Boolean) as DashboardSlide[];
  }

  selectSlide(index: number) {
    this.currentSlideIndex = index;
    this.selects.emit(this.slides[index].serial);

    if (this.playing) this.setNext();
  }

  play() {
    this.playing = true;
    this.setNext();
  }

  pause() {
    this.playing = false;
    clearTimeout(this.playTimer);
  }

  togglePlay() {
    this.playing ? this.pause() : this.play();
  }

  setNext() {
    clearTimeout(this.playTimer);

    this.playTimer = setTimeout(() => {
      const nextIndex =
        this.slides.length - 1 === this.currentSlideIndex
          ? 0
          : this.currentSlideIndex + 1;

      this.selectSlide(nextIndex);
    }, this.slides[this.currentSlideIndex].play_time * 60 * 1000);
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevOrder = [...this.slidesOrder];
    moveItemInArray(this.slidesOrder, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== this.slidesOrder[i])) {
      this.slides = this.slidesOrder
        .map((o) => this.dashboard.slides.find((t) => t.serial === o))
        .filter(Boolean) as DashboardSlide[];

      this.updateOrder();
    }
  }

  updateOrder() {
    this.preloader = true;
    this.state
      .updateSlidesOrder(this.dashboard.serial, this.slidesOrder)
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

  openDialog(tmp: TemplateRef<any>, slide?: DashboardSlide) {
    if (slide) {
      this.form.controls.title.setValue(slide.title);
      this.form.controls.play_time.setValue(slide.play_time);
    }

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
    this.state
      .addSlide(this.dashboard.serial, this.form.getRawValue())
      .subscribe({
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

  updateSlide(c: Record<string, any>, serial: string) {
    this.state
      .updateSlide(this.dashboard.serial, serial, this.form.getRawValue())
      .subscribe({
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

  removeSlide(c: Record<string, any>, serial: string) {
    this.state.removeSlide(this.dashboard.serial, serial).subscribe({
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
