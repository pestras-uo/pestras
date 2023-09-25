import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Workflow } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";
import { Observable, tap } from "rxjs";

@Component({
  selector: 'pestras-workflows-list',
  templateUrl: './workflows-list.view.html'
})
export class WorkflowsListViewComponent implements OnInit {

  list$!: Observable<Workflow[]>;

  @Input({ required: true })
  blueprint!: string;
  @Input({ required: true })
  selected: Workflow | null = null;
  @Input()
  editable = false;

  @Output()
  selects = new EventEmitter<Workflow>();
  @Output()
  add = new EventEmitter();
  @Output()
  noData = new EventEmitter();

  constructor(
    private wfState: WorkflowsState
  ) { }

  ngOnInit(): void {
    this.list$ = this.wfState.selectGroup(this.blueprint)
      .pipe(
        tap(list => !this.selected && list.length && this.selects.emit(list[0])),
        tap(list => {
          if (list.length === 0)
            setTimeout(() => this.noData.emit())
        }),
      );
  }
}