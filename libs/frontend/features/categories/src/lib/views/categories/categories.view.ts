/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { Category } from '@pestras/shared/data-model';

@Component({
  selector: 'app-categories',
  template: `
    <ng-container *contra="let c">

      <app-categories-list
        *ngIf="!selected.length else branches"
        [bp]="bp"
        [editable]="editable"
        (selects)="this.selected = [$event]"
      ></app-categories-list>
      
      <ng-template #branches>
        <app-category-details
          [bp]="bp"
          [editable]="editable"
          [selected]="selected"
          (selects)="this.selected = $event"
        ></app-category-details>
      </ng-template>
    </ng-container>
  `,
})
export class CategoriesView {
  selected: Category[] = [];

  @Input({ required: true })
  bp!: string;
  @Input()
  editable = false;
}
