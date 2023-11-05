import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TopicsState } from '@pestras/frontend/state';
import { Role } from '@pestras/shared/data-model';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'pestras-topics-list',
  templateUrl: './topics-list.view.html',
  styleUrls: ['./topics-list.view.scss'],
})
export class TopicsListViewComponent {
  readonly roles = Role;
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  readonly topics$ = this.state.selectGroup(null)
    .pipe(
      switchMap((list) => {
        return this.searchControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map((search) => search ? list.filter((t) => t.name.includes(search)) : list)
        );
      }),
      tap((list) => this.selected || (list.length > 0 && this.selects.next(list[0].serial)))
    );

  @Input({ required: true })
  selected!: string;

  @Output()
  readonly selects = new EventEmitter<string>();
  @Output()
  add = new EventEmitter();

  constructor(private state: TopicsState) { }
}
