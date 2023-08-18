import { Db } from 'mongodb';
import { Core } from '@pestras/backend/util';
import { getBySerial, getHistory, search } from './read';
import { pushHistory } from './util';
import { deleteRecod } from './delete';
import { create } from './create';
import { update } from './update';

export class DataRecordsModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.pubSub.on('data-db-connected', _db => this.db = _db);
  }

  // read
  // --------------------------------------------------------------------------------
  search = search.bind(this);
  getBySerial = getBySerial.bind(this);
  getHistory = getHistory.bind(this);

  // create
  // --------------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // --------------------------------------------------------------------------------
  update = update.bind(this);

  // delete
  // --------------------------------------------------------------------------------
  delete = deleteRecod.bind(this);

  // util
  // --------------------------------------------------------------------------------
  protected pushHistory = pushHistory.bind(this);
}