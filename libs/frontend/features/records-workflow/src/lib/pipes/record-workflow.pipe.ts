import { Pipe, PipeTransform } from "@angular/core";
import { RecordsWorkflowService } from "libs/frontend/state/src/lib/record-workflow/records-workflow.service";

@Pipe({ name: 'rWorkflow' })
export class RecordWorkflowPipe implements PipeTransform {

  constructor(private service: RecordsWorkflowService) {}

  transform(record: string, dataStore: string) {
    return this.service.getByRecord({ ds: dataStore, record })
  }
}