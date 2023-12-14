/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { ContentState } from '@pestras/frontend/state';
import {
  ContentView,
  ContentViewType,
  EntityContentViews,
} from '@pestras/shared/data-model';
import { Observable, filter, tap } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastService } from '@pestras/frontend/ui';

@Component({
  selector: 'app-content-views',
  templateUrl: './content-views.component.html',
  styles: [
    `
      .report-view {
        position: relative;
        margin-block-end: 32px;
      }

      .view-actions {
        position: absolute;
        background-color: var(--surface1);
        border-radius: 18px;
        inset-inline-start: calc(100% + 4px);
      }
    `,
  ],
})
export class ContentViewsComponent implements OnChanges {
  readonly imageControl = new FormControl<File | null>(null, {
    validators: Validators.required,
    nonNullable: true,
  });
  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    type: this.fb.nonNullable.control<ContentViewType>(
      ContentViewType.RICH_TEXT,
      Validators.required
    ),
    sub_title: [''],
    content: [''],
  });

  type = this.form.controls.type;
  views: ContentView[] = [];
  order: string[] = [];
  preloader = false;
  dialogRef: DialogRef | null = null;
  editMode = false;

  content$!: Observable<EntityContentViews | null>;

  @Input({ required: true })
  entity!: string;
  @Input()
  editable = false;
  @Input()
  size = 'normal';

  constructor(
    private state: ContentState,
    private dialog: Dialog,
    private readonly fb: FormBuilder,
    private readonly toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.content$ = this.state.select(this.entity).pipe(
      filter(Boolean),
      tap((c) => {
        this.order = [...c.views_order];
        this.views = this.order
          .map((s) => c.views.find((v) => v.serial === s) ?? null)
          .filter(Boolean) as ContentView[];
      })
    );
  }

  // Reorder
  // ---------------------------------------------------------------------------------
  drop(event: CdkDragDrop<string[]>) {
    const prevOrder = [...this.order];
    moveItemInArray(this.order, event.previousIndex, event.currentIndex);

    if (prevOrder.some((el, i) => el !== this.order[i])) {
      this.views = this.order
        .map((o) => this.views.find((v) => v.serial === o))
        .filter(Boolean) as ContentView[];
      this.updateOrder();
    }
  }

  updateOrder() {
    this.preloader = true;

    this.state.updateOrder(this.entity, this.order).subscribe({
      next: () => {
        this.preloader = false;
      },
      error: (e) => {
        console.error(e);
        this.preloader = false;
      },
    });
  }

  openDialog(tmp: TemplateRef<any>, view?: ContentView) {
    if (view) {
      if (
        view.type === ContentViewType.RICH_TEXT ||
        view.type === ContentViewType.VIDEO
      )
        this.form.controls.content.setValue(view.content || '');

      this.form.controls.title.setValue(view.title || '');
      this.form.controls.sub_title.setValue(view.sub_title || '');
      this.form.controls.type.setValue(view.type);
    }

    this.dialogRef = this.dialog.open(tmp, { data: view });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.form.reset();
    this.imageControl.reset();
    this.preloader = false;
  }

  submitView(c: Record<string, any>, view?: string) {
    this.preloader = true;

    const data: any = { ...this.form.getRawValue() };
    data.image = this.imageControl.value ?? null;

    const req: Observable<any> = view
      ? this.state.updateView(this.entity, view, data)
      : this.state.addView(this.entity, data);

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

  removeView(c: Record<string, any>, view: string) {
    this.preloader = true;

    this.state.removeView(this.entity, view)
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
      })
  }
}
