/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db } from "mongodb";
import { getByRecord, getRecordActiveWf } from "./read";
import { publishRecord } from "./publish";
import { approve } from "./approve";
import { reject } from "./reject";
import { DataRecordState, RecordWorkflow, RecordWorkflowState, User, WorkflowTriggers } from "@pestras/shared/data-model";
import { Core } from "@pestras/backend/util";

export class RecordWorkflowModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.channel.on('data-db-connected', _db => this.db = _db);
  }

  getByRecord: (ds: string, record: string) => Promise<RecordWorkflowState | null> = getByRecord.bind(this);
  getRecordActiveWf: (ds: string, record: string) => Promise<RecordWorkflow | null> = getRecordActiveWf.bind(this);

  publish: (ds: string, serial: string, trigger: WorkflowTriggers, msg?: string) => Promise<boolean> = publishRecord.bind(this);
  approve: (ds: string, serial: string, step: string, msg: string, issuer: User) => Promise<DataRecordState | null> = approve.bind(this);
  reject: (ds: string, serial: string, step: string, msg: string, issuer: User) => Promise<DataRecordState> = reject.bind(this);
}