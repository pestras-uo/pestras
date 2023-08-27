/* eslint-disable @typescript-eslint/no-explicit-any */
export const clientApiDataStoreParamOperators = ['$eq', '$ne', '$gte', '$lte', '$regex'] as const;

export type ClientApiDataStoreParamOperators = typeof clientApiDataStoreParamOperators[number];

export interface ClientApiDataStoreParam {
  serial: string;
  required: boolean;
  default: any | null;
  field: string;
  operator: ClientApiDataStoreParamOperators;
  /**
   * to use same field with different operators
   */
  alias: string | null;
}

export interface ClientApiDataStore {
  serial: string;
  // max records cound = limit rows
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