/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersGroupsState } from '@pestras/frontend/state';
import { debounceTime, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.view.html',
  styleUrls: ['./list.view.scss']
})
export class ListView {

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly groups$ = this.searchControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(300),
      switchMap(term => term ? this.state.selectMany(g => g.name.includes(term)) : this.state.data$),
      tap(list => this.selected || (list.length > 0 && this.selects.next(list[0].serial)))
    );

  @Input({ required: true })
  selected!: string;

  @Output()
  add = new EventEmitter();
  @Output()
  readonly selects = new EventEmitter<string>();

  constructor(private state: UsersGroupsState) {}
}
