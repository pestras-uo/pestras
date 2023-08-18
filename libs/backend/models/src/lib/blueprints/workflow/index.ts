import { Db } from "mongodb";
import { Core } from "@pestras/backend/util";
import { getByRecord } from "./read";
import { create } from "./create";
import { publish } from "./publish";
import { approve } from "./approve";
import { reject } from "./reject";
import { deleteWorkflow } from "./delete";

export class RecordWorkflowModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.pubSub.on('data-db-connected', _db => this.db = _db);
  }

  getByRecord = getByRecord.bind(this);

  create = create.bind(this);

  publish = publish.bind(this);
  approve = approve.bind(this);
  reject = reject.bind(this);

  delete = deleteWorkflow.bind(this);
}