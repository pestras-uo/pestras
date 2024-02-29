/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EntityAccessState } from '@pestras/frontend/state';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { EntityAccess } from '@pestras/shared/data-model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'pestras-entity-access',
  templateUrl: './entity-access.view.html'
})
export class EntityAccessViewComponent implements OnInit {

  private ud = untilDestroyed();

  readonly control = new FormControl('', { validators: Validators.required, nonNullable: true });
  
  allowCtrl!: FormControl<boolean>;
  access$!: Observable<EntityAccess | null>;
  preloader = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  entity!: string;

  constructor(
    private state: EntityAccessState,
    private dialog: Dialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.access$ = this.state.select(this.entity)
      .pipe(tap(access => {
        this.allowCtrl = new FormControl(!!access?.allow_guests, { nonNullable: true });

        this.allowCtrl.valueChanges
          .pipe(this.ud())
          .subscribe(v => this.allowGuests(v));
      }))
  }

  openDialog(tmp: TemplateRef<unknown>, type: string) {
    this.dialogRef = this.dialog.open(tmp, { data: type });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.control.reset();
  }

  filterEntity<T extends { serial: string; }>(entity: T, options: string[] = [], exclude = false) {
    return exclude 
    ? !options.includes(entity.serial)
    : options.includes(entity.serial);
  }

  mapEntity<T extends { serial: string; name?: string; fullname?: string; }>(entity: T) {
    return { name: entity.name ?? entity.fullname, value: entity.serial };
  }

  allowGuests(allow: boolean) {
    this.preloader = true;

    this.state.allowGuests(this.entity, allow)
      .subscribe({
        next: () => this.preloader = false,
        error: () => this.preloader = false
      });
  }

  add(c: Record<string, any>, type: string) {
    this.preloader = true;

    (
      type === 'orgunit'
        ? this.state.addOrgunit(this.entity, this.control.value)
        : type === 'user'
          ? this.state.addUser(this.entity, this.control.value)
          : this.state.addGroup(this.entity, this.control.value)
    )
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

  remove(c: Record<string, any>, type: string, serial: string) {
    (
      type === 'orgunit'
        ? this.state.removeOrgunit(this.entity, serial)
        : type === 'user'
          ? this.state.removeUser(this.entity, serial)
          : this.state.removeGroup(this.entity, serial)
    )
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
