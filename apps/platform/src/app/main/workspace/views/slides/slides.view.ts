/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Workspace,
  WorkspaceDashboardSlide,
} from '@pestras/shared/data-model';
import { WorkspaceState } from '@pestras/frontend/state';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.view.html',
  styles: [
    `
      :host {
        display: block;
        padding: 32px;
      }
    `,
  ],
})
export class SlidesView implements OnInit, OnChanges {
  private playTimer: any = null;
  private currentSlideIndex = 0;

  readonly select = new FormControl<number | null>(null, { nonNullable: true });

  slides: { name: string; value: number }[] = [];
  active: WorkspaceDashboardSlide | null = null;
  playing = false;
  preloader = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  ws!: Workspace;

  constructor(private state: WorkspaceState, private dialog: Dialog) {}

  ngOnChanges(): void {
    this.slides = this.ws.slides.map((s, i) => ({ name: s.name, value: i }));
  }

  ngOnInit(): void {
    if (this.slides.length) this.select.setValue(0);

    this.select.valueChanges
      .pipe(startWith(this.select.value ?? null))
      .subscribe((i) => {
        if (i === null) {
          this.active = null;
          this.pause();
          this.currentSlideIndex = 0;
        } else {
          this.currentSlideIndex = i;
          this.active = this.ws.slides[i] ?? null;

          if (this.playing) this.setNext();
        }
      });
  }

  mapSlides(slide: WorkspaceDashboardSlide) {
    return { name: slide.name, value: slide.slide };
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
        this.ws.slides.length - 1 === this.currentSlideIndex
          ? 0
          : this.currentSlideIndex + 1;

      this.select.setValue(this.slides[nextIndex].value);
    }, 60 * 1000);
  }

  openDialog(tmp: TemplateRef<any>, serial: string) {
    this.dialogRef = this.dialog.open(tmp, { data: serial });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
  }

  removeSlide(serial: string) {
    this.preloader = true;

    const index =
      this.ws.slides.length === 1
        ? null
        : this.ws.slides.length - 1 === this.currentSlideIndex
        ? 0
        : this.currentSlideIndex + 1;

    this.select.setValue(index);

    this.state.removeSlide(serial).subscribe({
      next: () => this.closeDialog(),
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }
}
