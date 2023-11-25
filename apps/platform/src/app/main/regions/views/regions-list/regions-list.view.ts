/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { RegionsState } from '@pestras/frontend/state';
import { Serial } from '@pestras/shared/util';
import { BehaviorSubject, combineLatest, map, startWith, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-regions-list',
  templateUrl: './regions-list.view.html',
  styleUrls: ['./regions-list.view.scss']
})
export class RegionsListView {

  private dialogRef: DialogRef | null = null;

  protected readonly searchControl = new FormControl('');

  readonly selected$ = new BehaviorSubject<string | null>(null);
  readonly regions$ = this.selected$.pipe(
    switchMap(parent => this.state.selectMany(r => Serial.isChild(parent ?? '', r.serial))),
    tap(list => {
      if (list.length === 1 && !this.selected$.getValue())
        this.selects.emit(list[0].serial);
    })
  );

  readonly search$ = combineLatest([
    this.regions$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(map(([regions, search]) => {
    return !search ? regions : regions.filter(r => r.name.includes(search))
  }));

  @Input()
  set selected(value: string) {
    this.searchControl.setValue('');
    this.selected$.next(value);
  }

  @Output()
  readonly selects = new EventEmitter<string>();

  constructor(
    private readonly state: RegionsState,
    private readonly dialog: Dialog
  ) { }

  openModal(ref: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(ref);
  }

  closeModal(serial?: string) {
    if (serial)
      this.selects.emit(serial);

    this.dialogRef?.close();
  }
}
