/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '@pestras/shared/data-model';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.view.html'
})
export class CategoriesListView {

  @Input({ required: true })
  bp!: string;
  @Input({ required: true })
  selected!: Category | null;
  @Input()
  editable = false;

  @Output()
  readonly selects = new EventEmitter<Category>();
  @Output()
  readonly add = new EventEmitter();
}
