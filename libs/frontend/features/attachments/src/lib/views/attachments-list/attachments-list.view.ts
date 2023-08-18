/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Attachment, DataStore, TableDataRecord } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { AttachmentsState } from '@pestras/frontend/state';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-attachments-list',
  templateUrl: './attachments-list.view.html',
  styles: [
  ]
})
export class AttachmentsListView implements OnInit {
  host = process.env['docs'];

  attachments$!: Observable<Attachment[]>;
  dialogRef: DialogRef | null = null;
  preloader = false;
  canAdd = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    attachment: this.fb.nonNullable.control<File>(null as any, Validators.required)
  });

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: TableDataRecord;
  @Input()
  editable = false;

  constructor(
    private state: AttachmentsState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.attachments$ = this.state.selectGroup(this.record['serial'])
      .pipe(tap(attachments => this.canAdd = attachments.length < this.dataStore.settings.max_attachments_count));
  }

  filterImages = (file: Attachment) => {
    return file.path.endsWith('.jpg') || file.path.endsWith('.jpeg') || file.path.endsWith('.png')
  }

  mapImages = (file: Attachment) => {
    return { src: file.path, id: file.serial, title: file.name };
  }

  filterFiles = (file: Attachment) => {
    return !this.filterImages(file);
  }

  openImageModal(tmp: TemplateRef<any>) {
    this.form.controls.name.setValue('Image');
    this.openModal(tmp);
  }

  openModal(tmp: TemplateRef<any>, serial?: string) {
    this.dialogRef = this.dialog.open(tmp, { data: serial });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
      this.form.reset();
      this.preloader = false;
    }
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    const data = this.form.getRawValue();

    this.state.create(this.record['serial'], data.name, data.attachment)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeModal();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  updateName(c: Record<string, any>, serial: string, name: string) {
    this.preloader = true;

    this.state.updateName(serial, name)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeModal();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  remove(c: Record<string, any>, serial: string) {
    this.preloader = false;

    this.state.remove(serial)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeModal();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
