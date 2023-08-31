/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, EventEmitter, HostBinding, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrgunitsState } from '@pestras/frontend/state';
import { Orgunit } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'pestras-orgunits-table',
  templateUrl: './orgunits-table.view.html'
})
export class OrgunitsTableView implements OnChanges {

  list$!: Observable<Orgunit[]>;
  search = new FormControl<string>('', { nonNullable: true });
  page$ = new BehaviorSubject<number>(1);
  pageSize = 5;
  count!: number;

  @HostBinding('class')
  hostClass = 'card h-fit';

  @Input({ required: true })
  parent!: string;

  @Output()
  selects = new EventEmitter<string>()

  constructor(private state: OrgunitsState) { }

  ngOnChanges(): void {
    this.list$ = this.state.selectMany(org => Serial.isBranch(org.serial, this.parent))
      .pipe(
        switchMap(orgunits => {
          return combineLatest([
            this.search.valueChanges.pipe(startWith('')),
            this.page$.pipe(distinctUntilChanged())
          ])
          .pipe(map(([search, page]) => {
            const searched = search ? orgunits.filter(o => o.name.includes(search)) : orgunits;
            this.count = searched.length;
            return searched.slice((page - 1) * this.pageSize, (page - 1) * this.pageSize + this.pageSize);
          }));
        })
      )
  }
}
