import { Model } from "../../model";
import { ApiQuery, ClientsApiLog } from '@pestras/shared/data-model';

export type ClientsApiLogInput = Omit<ClientsApiLog, 'date'>;

export class ClientsApiLogModel extends Model<ClientsApiLog> {

  search(query: ApiQuery<ClientsApiLog>) {
    return this.col.find(query).toArray();
  }

  insert(input: ClientsApiLogInput) {
    return this.col.insertOne({ ...input, date: new Date() })
  }
}