import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { BlueprintsState, SessionState } from "@pestras/frontend/state";
import { Role } from "@pestras/shared/data-model";
import { Serial } from "@pestras/shared/util";
import { debounceTime, map, startWith, switchMap, tap } from "rxjs";

@Component({
  selector: 'pestras-blueprints-list',
  templateUrl: './blueprints-list.view.html',
  styleUrls: ['./blueprints-list.view.scss']
})
export class BlueprintsListViewComponent {
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  readonly roles = Role;

  readonly blueprints$ = this.state.data$
    .pipe(
      map(list => {
        const session = this.session.get();

        return session?.roles.includes(Role.ADMIN)
          ? list.filter(b => Serial.isBranch(b.orgunit, session.orgunit, true))
          // otherwise is data engineer
          : list.filter(b => b.owner === session?.serial || b.collaborators.includes(session?.serial || ''));
      }),
      switchMap(list => {
        return this.searchControl.valueChanges
          .pipe(
            startWith(''),
            debounceTime(300),
            map(search => search ? list.filter(t => t.name.includes(search)) : list)
          )
      }),
      tap(list => this.selected || (list.length > 0 && this.selects.next(list[0].serial)))
    );

  @Input({ required: true })
  selected!: string;

  @Output()
  readonly selects = new EventEmitter<string>();
  @Output()
  add = new EventEmitter();

  constructor(
    private state: BlueprintsState,
    private session: SessionState
  ) { }
}