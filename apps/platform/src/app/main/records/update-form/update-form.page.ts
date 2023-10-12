/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordsService } from '@pestras/frontend/state';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { DataRecord, DataRecordState, DataStore, Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.page.html',
  styles: [`
    :host {
      display: block;
      height: var(--main-height);
      overflow: auto;
    }
  `]
})
export class UpdateFormPage implements OnInit {
  private ud = untilDestroyed();

  form!: FormGroup<Record<string, any>>;
  preloader = false;
  fields: Field[] = [];

  context: any;

  @Input({ required: true })
  topic!: string;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  group!: string;
  @Input({ required: true })
  record!: DataRecord;
  @Input({ required: true })
  state!: DataRecordState;

  constructor(
    private service: RecordsService,
    private fb: FormBuilder,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() {

    this.form = this.fb.nonNullable.group<Record<string, any>>({
      topic: [this.topic, Validators.required],
    });

    this.context = this.record;

    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        this.context = Object.assign({}, this.record, v)
      });

    this.fields = this.dataStore.fields.filter(f => {
      return f.group === this.group
        && (!f.constant || (f.constant && this.record[f.name] === null))
        && !f.system
        && !f.automated
    });

    for (const field of this.fields) {
      const value = this.record[field.name] ?? null;
      const control = new FormControl(value);

      if (field.required)
        control.setValidators(Validators.required);

      this.form.addControl(field.name, control);
    }
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.service.update(
      { draft: this.state === 'draft' ? "1" : "0", ds: this.dataStore.serial, serial: this.record['serial'] },
      this.form.getRawValue()
    )
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.router.navigate(
            ['/main/records', this.topic, this.dataStore.serial, this.record['serial']], 
            { replaceUrl: true, queryParams: { state: 'draft' } }
          );
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
