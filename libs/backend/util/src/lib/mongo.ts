import { MongoClient, ServerApiVersion } from 'mongodb';
import { Core } from './core';

export interface MongoClientConfig {
  dbUoAdName: string;
  dbUoName: string;
  dbUrl: string;
  dbUoDataName: string;
}

class DB extends Core {

  async connect<T extends MongoClientConfig>(config: T) {
    console.log("connecting to database...");

    if (!config.dbUrl)
      throw new Error('database url not provided!');
  
    const client = new MongoClient(config.dbUrl, { serverApi: ServerApiVersion.v1 });
    const conn = await client.connect();
  
    console.log("connected to database successfully");
  
    this.pubSub.emit('ad-db-connected', conn.db(config.dbUoAdName));
    this.pubSub.emit('uo-db-connected', conn.db(config.dbUoName));
    this.pubSub.emit('data-db-connected', conn.db(config.dbUoDataName));
  
    process.once('exit', () => this.closeConn(conn));
  }
  
  closeConn(conn: MongoClient) {
    if (conn) {
      console.log('closing db connection');
      conn.close();
    }
  }
}

export const db = new DB();