import { Db } from 'mongodb';
import { Core } from '@pestras/backend/util';
import { getBySerial, getCategoryValues, getHistory, search } from './read';
import { pushHistory, revertHistory } from './history';
import { deleteRecod } from './delete';
import { create } from './create';
import { update } from './update';
import { ApiQuery, DataRecord, DataRecordHistroyItem, TableDataRecord, User } from '@pestras/shared/data-model';

export class DataRecordsModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.channel.on('data-db-connected', _db => this.db = _db);
  }

  col(name: string) {
    return this.db.collection(name);
  }

  dropCol(name: string) {
    return this.db.dropCollection(name);
  }

  // read
  // --------------------------------------------------------------------------------
  search: (dataStoreSerial: string, query: Partial<ApiQuery<DataRecord>>) => Promise<{ count: number; results: TableDataRecord[] }> = search.bind(this);
  getBySerial: (dataStoreSerial: string, serial: string, projection?: Record<string, 0 | 1>) => Promise<TableDataRecord | null> = getBySerial.bind(this);
  getCategoryValues: (dataStoreSerial: string, catField: string, search: unknown) => Promise<string[]> = getCategoryValues.bind(this);
  getHistory: (dataStoreSerial: string, serial: string) => Promise<DataRecordHistroyItem[]> = getHistory.bind(this);

  // create
  // --------------------------------------------------------------------------------
  create: (ds: string, recSerial: string, data: DataRecord, issuer: User) => Promise<TableDataRecord> = create.bind(this);

  // update
  // --------------------------------------------------------------------------------
  update: (ds: string, recordSerial: string, draft: boolean, input: DataRecord, issuer: string) => Promise<TableDataRecord | null> = update.bind(this);

  // History
  // --------------------------------------------------------------------------------
  pushHistory: (dataStore: string, record: TableDataRecord) => Promise<boolean> = pushHistory.bind(this);
  
  revertHistory: (ds: string, serial: string) => Promise<TableDataRecord> = revertHistory.bind(this);

  // delete
  // --------------------------------------------------------------------------------
  delete: (ds: string, recordSerial: string, draft: boolean, issuer: User, message: string) => Promise<boolean> = deleteRecod.bind(this);

}