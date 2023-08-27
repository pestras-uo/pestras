import { Pipe, PipeTransform } from '@angular/core';
import { WorkspaceState } from '@pestras/frontend/state';
import { Workspace } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'workspace',
})
export class WorkspacePipe implements PipeTransform {

  constructor(private state: WorkspaceState) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(_: unknown): Observable<Workspace | null> {
    return this.state.select();
  }
}
