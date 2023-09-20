import { MongoClient, ServerApiVersion } from 'mongodb';
import { Core } from './core';

export interface MongoClientConfig {
  adDb: string;
  sysDb: string;
  dataDb: string;
  dbUrl: string;
}

class DB extends Core {

  async connect<T extends MongoClientConfig>(config: T) {
    console.log("connecting to database...");

    if (!config.dbUrl)
      throw new Error('database url not provided!');

    const client = new MongoClient(config.dbUrl, { serverApi: ServerApiVersion.v1 });
    const conn = await client.connect();

    console.log("connected to database successfully");

    this.channel.emit('ad-db-connected', conn.db(config.adDb));
    this.channel.emit('sys-db-connected', conn.db(config.sysDb));
    this.channel.emit('data-db-connected', conn.db(config.dataDb));

    process
      .once('exit', () => this.closeConn(conn))
      .once('SIGTERM', () => this.closeConn(conn))
      .once('SIGINT', () => this.closeConn(conn));

    return conn;
  }

  closeConn(conn: MongoClient) {
    if (conn) {
      console.log('closing db connection');
      conn.close();
    }
  }
}

export const db = new DB();