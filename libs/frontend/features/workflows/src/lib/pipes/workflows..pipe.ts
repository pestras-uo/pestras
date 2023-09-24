import { Pipe, PipeTransform } from "@angular/core";
import { Workflow } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";
import { Observable } from "rxjs";

@Pipe({ name: 'workflows' })
export class WorkflowsPipe implements PipeTransform {

  constructor(private state: WorkflowsState) {}

  transform(bp: string): Observable<Workflow[]> {
    return this.state.selectGroup(bp);
  }
}