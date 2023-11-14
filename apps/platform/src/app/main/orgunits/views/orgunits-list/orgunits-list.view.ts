/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Serial } from '@pestras/shared/util';
import { OrgunitsState, SessionState } from '@pestras/frontend/state';
import { Observable, debounceTime, map, startWith, switchMap, tap } from 'rxjs';
import { Orgunit } from '@pestras/shared/data-model';

@Component({
  selector: 'app-orgunits-list',
  templateUrl: './orgunits-list.view.html',
  styleUrls: ['./orgunits-list.view.scss'],
})
export class OrgunitsListView implements OnInit {
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  orgunits$!: Observable<Orgunit[]>;

  @Input({ transform: booleanAttribute })
  isPartners!: boolean;
  @Input({ required: true })
  selected!: string;

  @Output()
  readonly selects = new EventEmitter<string>();
  @Output()
  add = new EventEmitter();

  constructor(
    private state: OrgunitsState,
    private session: SessionState
  ) { }

  ngOnInit(): void {
    this.orgunits$ = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        switchMap(search => this.state.selectMany(o => {
          if (o.is_partner !== this.isPartners || (search && !o.name.includes(search)))
            return false;

          return this.isPartners === true ? Serial.countLevels(o.serial) === 1 : o.serial !== '*';
        })),
        map(list => this.session.get()?.orgunit === '*'
          ? list
          : list.filter(o => Serial.isBranch(o.serial, this.session.get()?.orgunit ?? '', true))
        ),
        map(list => list.sort((a, b) => {
          const diff = Serial.countLevels(a.serial) - Serial.countLevels(b.serial);

          return diff !== 0
            ? diff
            : a.name < b.name ? -1 : 1
        })),
        tap(list => this.selected || (list.length > 0 && this.selects.next(list[0].serial)))
      );
  }
}
