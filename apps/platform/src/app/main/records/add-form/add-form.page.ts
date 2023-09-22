/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordsService } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataStore, Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-form',
  templateUrl: './add-form.page.html',
  styles: [`
    :host {
      display: block;
      height: var(--main-height);
      overflow: auto;
    }
  `]
})
export class AddFormPage implements OnInit {

  form = this.fb.nonNullable.group<Record<string, any>>({});
  preloader = false;
  groups: { group: string; fields: Field[]; }[] = [];
  others: Field[] = [];

  @Input({ required: true })
  topic?: string;
  @Input({ required: true })
  dataStore!: DataStore;

  constructor(
    private service: RecordsService,
    private fb: FormBuilder,
    private toast: ToastService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.groups = [];

    if (this.topic)
      this.form.addControl('topic', new FormControl<string>(this.topic));

    if (!this.dataStore)
      return;

    const fields = this.dataStore.fields as Field[];

    for (const field of fields) {

      if (field.system || (!field.initial && !field.required))
        continue;

      if (!field.group) {
        this.others.push(field);
        continue;
      }

      const group = this.groups.find(g => g.group === field.group);

      if (group)
        group.fields.push(field);
      else
        this.groups.push({ group: field.group, fields: [field] });

      const control = new FormControl(null);

      if (field.required)
        control.setValidators(Validators.required);

      this.form.addControl(field.name, control);
    }
  }
  
  add(c: Record<string, any>) {
    this.preloader = true;

    this.service.create({ ds: this.dataStore.serial }, this.form.getRawValue())
      .subscribe({
        next: r => {
          this.toast.msg(c['success'].default, { type: 'success' });

          this.topic
          ? this.router.navigate(['/main/records', this.topic, this.dataStore.serial, r.serial], { replaceUrl: true })
          : this.location.back();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      })
  }
}
