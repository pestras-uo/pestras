/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApiDataStoreParamOperators } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";

export enum ClientApiValidators {
  CREATE = 'createClientApi',
  UPDATE = 'updateClientApi',
  ADD_IP = 'addClientApiIP',
  REMOVE_IP = 'removeClientApiIP',
  ADD_DATA_STORE = 'addClientApiDataStore',
  UPDATE_DATA_STORE = 'updateClientApiDataStore',
  ADD_PARAM = 'addClientApiParam',
  UPDATE_PARAM = 'updateClientApiParam'
}

new Validall(ClientApiValidators.CREATE, {
  namespace: { $type: 'string' },
  client_name: { $type: 'string' }
});

new Validall(ClientApiValidators.UPDATE, {
  client_name: { $type: 'string' }
});

new Validall(ClientApiValidators.ADD_IP, {
  ip: { $type: 'string' }
});

new Validall(ClientApiValidators.REMOVE_IP, {
  ip: { $type: 'string' }
});

new Validall(ClientApiValidators.ADD_DATA_STORE, {
  topic: { $type: 'string', $nullable: true },
  max: { $type: 'number' },
  method: { $default: 'GET', $enum: ['GET', 'POST'] }
});

new Validall(ClientApiValidators.UPDATE_DATA_STORE, {
  topic: { $type: 'string', $nullable: true },
  max: { $type: 'number' },
  method: { $default: 'GET', $enum: ['GET', 'POST'] }
});

new Validall(ClientApiValidators.ADD_PARAM, {
  field: { $type: 'string' },
  alias: { $nullable: true, $type: 'string' },
  operator: { $default: 'eq', $enum: clientApiDataStoreParamOperators as any },
  required: { $cast: 'boolean', $default: false }, 
  default: { $nullable: true } 
});

new Validall(ClientApiValidators.UPDATE_PARAM, {
  field: { $type: 'string' },
  alias: { $nullable: true, $type: 'string' },
  operator: { $default: 'eq', $enum: clientApiDataStoreParamOperators as any },
  required: { $cast: 'boolean', $default: false }, 
  default: { $nullable: true } 
});