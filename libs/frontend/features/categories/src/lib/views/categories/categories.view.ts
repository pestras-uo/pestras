/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { Category } from '@pestras/shared/data-model';

@Component({
  selector: 'app-categories',
  template: `
    <ng-container *contra="let c">
      <div class="toolbar">
        <h2>{{ c['categories'] }}</h2>
        <div class="grow"></div>
        <button
          *ngIf="selected"
          class="btn-round-btn-small btn-icon"
          (click)="selected = null"
        >
          <i puiIcon="restart" size="small"></i>
        </button>
        <button
          *ngIf="editable"
          class="btn-round-btn-small btn-icon"
          (click)="openDialog(addModal)"
        >
          <i puiIcon="add" size="small"></i>
        </button>
      </div>

      <div class="divider mbs-4 mbe-8"></div>

      <app-categories-list
        *ngIf="!selected"
        [bp]="bp"
        [editable]="editable"
        [selected]="selected"
        (selects)="this.selected = $event"
        (add)="openDialog(addModal)"
      ></app-categories-list>
      
      <app-category-details
        *ngIf="selected"
        [bp]="bp"
        [editable]="editable"
        [selected]="selected"
      ></app-category-details>
    </ng-container>

    <ng-template #addModal>
      <app-add-category
        [bp]="bp"
        (closes)="closeDialog($event)"
      ></app-add-category>
    </ng-template>
  `,
})
export class CategoriesView {
  private dialogRef: DialogRef | null = null;

  selected: Category | null = null;

  @Input({ required: true })
  bp!: string;
  @Input()
  editable = false;

  constructor(private dialog: Dialog) { }

  openDialog(ref: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(ref);
  }

  closeDialog(cat: Category | null) {
    if (cat) this.selected = cat;

    !!this.dialogRef && this.dialogRef.close();
  }
}
