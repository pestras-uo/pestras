import { Db } from 'mongodb';
import { Core } from '@pestras/backend/util';
import { getBySerial, getHistory, search } from './read';
import { pushHistory, revertHistory } from './history';
import { deleteRecod } from './delete';
import { create } from './create';
import { UpdateRecordInput, update } from './update';
import { ApiQuery, DataRecord, DataRecordHistroyItem, DataRecordState, TableDataRecord, User } from '@pestras/shared/data-model';

export { UpdateRecordInput };

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
  search: (dataStoreSerial: string, query: Partial<ApiQuery<DataRecord>>) => Promise<{ count: number; results: DataRecord[] }> = search.bind(this);
  getBySerial: <T extends DataRecord>(dataStoreSerial: string, serial: string, state?: DataRecordState) => Promise<T | null> = getBySerial.bind(this);
  getHistory: (dataStoreSerial: string, serial: string) => Promise<DataRecordHistroyItem[]> = getHistory.bind(this);

  // create
  // --------------------------------------------------------------------------------
  create: (ds: string, recSerial: string, data: DataRecord, issuer: User) => Promise<TableDataRecord> = create.bind(this);

  // update
  // --------------------------------------------------------------------------------
  update: (ds: string, recordSerial: string, input: UpdateRecordInput, issuer: string) => Promise<TableDataRecord> = update.bind(this);

  // History
  // --------------------------------------------------------------------------------
  pushHistory: (dataStore: string, record: TableDataRecord) => Promise<boolean> = pushHistory.bind(this);
  
  revertHistory: (ds: string, serial: string) => Promise<TableDataRecord> = revertHistory.bind(this);

  // delete
  // --------------------------------------------------------------------------------
  delete: (ds: string, recordSerial: string, draft: boolean) => Promise<boolean> = deleteRecod.bind(this);

}