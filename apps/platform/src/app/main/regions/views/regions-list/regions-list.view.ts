/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Region } from '@pestras/shared/data-model';


@Component({
  selector: 'app-regions-list',
  templateUrl: './regions-list.view.html',
  styleUrls: ['./regions-list.view.scss']
})
export class RegionsListView {

  private dialogRef: DialogRef | null = null;

  protected readonly searchControl = new FormControl('');

  @Input({ required: true })
  selected!: string;

  @Output()
  readonly selects = new EventEmitter<string>();

  constructor(
    private readonly dialog: Dialog
  ) { }

  selectFirst = (regions: Region[]) => {
    if (!this.selected && regions.length)
      setTimeout(() => {
        this.selects.emit(regions[0].serial);
      });

    return regions;
  }

  openModal(ref: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(ref);
  }

  closeModal(serial?: string) {
    if (serial)
      this.selects.emit(serial);
    !!this.dialogRef && this.dialogRef.close();
  }
}
