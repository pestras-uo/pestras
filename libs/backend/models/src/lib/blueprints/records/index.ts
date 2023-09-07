import { Db } from 'mongodb';
import { Core } from '@pestras/backend/util';
import { getBySerial, getHistory, search } from './read';
import { applyHistory, pushHistory, revertHistory } from './history';
import { deleteRecod } from './delete';
import { create } from './create';
import { update } from './update';
import { ApiQuery, DataRecord, DataRecordHistroyItem, DataStore, TableDataRecord, User } from '@pestras/shared/data-model';

export class DataRecordsModel extends Core {
  protected db!: Db;

  constructor() {
    super();

    this.pubSub.on('data-db-connected', _db => this.db = _db);
  }

  // read
  // --------------------------------------------------------------------------------
  search: (dataStoreSerial: string, query: ApiQuery<DataRecord>) => Promise<{ count: number; results: DataRecord[] }> = search.bind(this);
  getBySerial: <T extends DataRecord>(dataStoreSerial: string, serial: string) => Promise<T | null> = getBySerial.bind(this);
  getHistory: (dataStoreSerial: string, serial: string) => Promise<DataRecordHistroyItem[]> = getHistory.bind(this);

  // create
  // --------------------------------------------------------------------------------
  create: (ds: DataStore, recSerial: string, data: DataRecord, issuer: User) => Promise<TableDataRecord> = create.bind(this);

  // update
  // --------------------------------------------------------------------------------
  update: (dataStore: DataStore, recordSerial: string, input: { group: string; data: DataRecord; }, issuer: string) => Promise<TableDataRecord> = update.bind(this);

  // History
  // --------------------------------------------------------------------------------
  protected pushHistory: (dataStore: string, record: TableDataRecord, fields: string[]) => Promise<boolean> = pushHistory.bind(this);
  
  applyHistory: (ds: string, serial: string) => Promise<TableDataRecord> = applyHistory.bind(this);
  revertHistory: (ds: string, serial: string) => Promise<TableDataRecord> = revertHistory.bind(this);

  // delete
  // --------------------------------------------------------------------------------
  delete: (dataStore: DataStore, recordSerial: string, issuer: User) => Promise<boolean> = deleteRecod.bind(this);

}