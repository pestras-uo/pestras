/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Comment,
  DataRecord,
  DataRecordHistroyItem,
  DataStore,
} from '@pestras/shared/data-model';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ToastService } from '@pestras/frontend/ui';
import { EnvService } from '@pestras/frontend/env';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommentsService, SessionState } from '@pestras/frontend/state';

@Component({
  selector: 'pestras-record-comments',
  templateUrl: './comments.view.html',
  styles: [],
})
export class CommentsViewComponent implements OnInit {
  //comments$!: Observable<Comment[]>;
  dialogRef: DialogRef | null = null;
  preloader = false;

  comments: Comment[] = [];

  readonly form = this.fb.group({
    text: ['', Validators.required],
  });

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: DataRecord;
  @Input()
  topic: string | null = null;

  @Output()
  selects = new EventEmitter<{ name: string; payload?: any }>();

  @Input()
  editable = false;

  constructor(
    private service: CommentsService,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService,
    private envServ: EnvService,
    private session: SessionState
  ) {}
  loadComments(): void {
    this.service.getAll({ serial: this.dataStore.serial }).subscribe((res) => {
      this.comments = res;
    });
  }
  ngOnInit(): void {
    this.loadComments();
  }

  //Reset form
  // Method to reset the form
  resetForm() {
    this.form.reset(); // This will reset the form to its initial state (empty input field)
  }

  add(c: Record<string, any>): void {
    this.preloader = true;

    const data = this.form.getRawValue();

    const obj: {
      record: string;
      text: string;
      create_date: Date;
      last_modified: Date;
    } = {
      record: this.dataStore.serial,
      text: data.text || '', // Use an empty string if data.text is falsy (null or undefined)
      create_date: new Date(),
      last_modified: new Date(),
    };

    this.service.create({ record: obj.record }, obj).subscribe(
      () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.loadComments(); // Reload comments after adding a new one
        this.form.reset(); // Reset the form after successful comment addition
      },
      (error: any) => {
        console.error(error);
        this.toast.msg(c['error'].default, { type: 'error' });
        this.preloader = false;
      }
    );
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

  update(c: Record<string, any>, serial: string) {
    const text = this.form.get('text')?.value || ''; // Ensure text is always a string

    this.service.update({ serial: serial }, { text: text }).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        const comment = this.comments.find((c) => c.serial == serial);
        if (comment) comment.text = text;
        console.log(comment);

        this.closeModal();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
      },
    });
  }

  delete(c: Record<string, any>, serial: string) {
    this.service.delete({ serial: serial }).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.comments = this.comments.filter((c) => c.serial !== serial);
        this.preloader = true;

        this.closeModal();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
      },
    });
    this.preloader = false;
  }

  openUpdateModal(tmp: TemplateRef<any>, text?: string, record?: string) {
    // Set the initial value of the name field in the form
    this.form.controls.text.setValue(text || '');

    this.openModal(tmp, record);
  }

  isNotExpired(comment: Comment) {
    return Date.now() - new Date(comment.create_date).getTime() < 300000;
  }
}
