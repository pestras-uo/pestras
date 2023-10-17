import { Pipe, PipeTransform } from "@angular/core";
import { RecordsWorkflowService } from "libs/frontend/state/src/lib/record-workflow/records-workflow.service";

@Pipe({ name: 'recordActiveWF' })
export class RecordActiveWorkflowPipe implements PipeTransform {

  constructor(private service: RecordsWorkflowService) {}

  transform(record: string, dataStore: string) {
    return this.service.getRecordActiveWF({ ds: dataStore, record })
  }
}