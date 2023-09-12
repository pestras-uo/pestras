/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db } from "mongodb";
import { Core } from "@pestras/backend/util";
import { getByRecord } from "./read";
import { create } from "./create";
import { publish } from "./publish";
import { approve } from "./approve";
import { reject } from "./reject";
import { deleteWorkflow } from "./delete";
import { RecordWorkflow, User, WorkflowState } from "@pestras/shared/data-model";

export class RecordWorkflowModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.pubSub.on('data-db-connected', _db => this.db = _db);
  }

  getByRecord: (ds: string, record: string) => Promise<RecordWorkflow> = getByRecord.bind(this);

  create: (ds: string, record: string) => Promise<any> = create.bind(this);

  publish: (ds: string, serial: string, issuer: User) => Promise<WorkflowState.PENDING | WorkflowState.APPROVED> = publish.bind(this);
  approve: (ds: string, serial: string, issuer: User) => Promise<boolean> = approve.bind(this);
  reject: (ds: string, serial: string, issuer: User) => Promise<boolean> = reject.bind(this);

  delete: (ds: string, record: string) => Promise<boolean> = deleteWorkflow.bind(this);
}