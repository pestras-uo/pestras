/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db } from "mongodb";
import { getByRecord, getRecordWfState, getWfStep } from "./read";
import { publishRecord } from "./publish";
import { approve } from "./approve";
import { reject } from "./reject";
import { cancel } from "./cancel";
import { RecordWorkflow, User, WorkflowTriggers } from "@pestras/shared/data-model";
import { Core } from "@pestras/backend/util";

export class RecordWorkflowModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.channel.on('data-db-connected', _db => this.db = _db);
  }

  getByRecord: (ds: string, record: string) => Promise<RecordWorkflow[]> = getByRecord.bind(this);
  getWfStep: (ds: string, step: string) => Promise<RecordWorkflow | null> = getWfStep.bind(this);
  getRecordWfState: (ds: string, record: string) => Promise<RecordWorkflow | null> = getRecordWfState.bind(this);

  publish: (ds: string, serial: string, trigger: WorkflowTriggers) => Promise<boolean> = publishRecord.bind(this);
  approve: (ds: string, serial: string, issuer: User) => Promise<boolean> = approve.bind(this);
  reject: (ds: string, serial: string, issuer: User) => Promise<boolean> = reject.bind(this);

  cancel: (ds: string, record: string) => Promise<boolean> = cancel.bind(this);
}