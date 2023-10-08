import { Component, Input } from '@angular/core';
import { Workflow } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-workflows',
  templateUrl: './workflows.view.html',
  styleUrls: ['./workflows.view.scss'],
})
export class WorkflowsViewComponent {
  isEmpty = false;
  form = false;
  selected: Workflow | null = null;

  @Input({ required: true })
  blueprint!: string;
  @Input()
  editable = false;
}
