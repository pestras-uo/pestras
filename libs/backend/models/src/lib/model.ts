/* eslint-disable @typescript-eslint/no-unused-vars */
import { Collection, Db, Document } from "mongodb";
import { Core } from "@pestras/backend/util";

export class Model<T extends Document> extends Core {
  protected col!: Collection<T>;

  constructor(dbName: string, protected _name: string) {
    super();

    this.init();

    this.pubSub.on<Db>(`${dbName}-db-connected`, db => this._onConnect(db));
  }

  protected init() {
    // 
  }

  protected onConnect(_: Db) {
    //
  }

  private _onConnect(db: Db) {
    this.col = db.collection(this._name);
    this.pubSub.emit(`${this._name}-model-ready`);

    this.onConnect(db);
  }

  protected collection<U extends T = T>() {
    return this.col as unknown as Collection<U>;
  }
}