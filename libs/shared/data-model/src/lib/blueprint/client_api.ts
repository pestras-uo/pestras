export const clientApiDataStoreParamOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'regex'] as const;

export type ClientApiDataStoreParamOperators = typeof clientApiDataStoreParamOperators[number];

export interface ClientApiDataStoreParam {
  serial: string;
  required: boolean;
  default: unknown | null;
  field: string;
  operator: ClientApiDataStoreParamOperators;
  /**
   * to use same field with different operators
   */
  alias: string | null;
}

export interface ClientApiDataStore {
  serial: string;
  max: number;
  params: ClientApiDataStoreParam[];
  method: 'GET' | 'POST';
  topic: string | null;
}

export interface ClientApi {
  serial: string;
  blueprint: string;
  client_name: string;
  ips: Array<string>;
  data_stores: ClientApiDataStore[];
  active: boolean;

  create_date: Date;
  last_modified: Date;
}