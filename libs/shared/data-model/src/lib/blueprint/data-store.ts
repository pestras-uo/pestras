import { IAggrPiplineStage } from "../util";
import { Field } from './fields';
import { WebServiceConfig } from './web-service';

export enum DataStoreType {
  TABLE = 'table',
  AGGREGATIONAL = 'aggregational',
  WEB_SERVICE = 'web_service'
}

export enum DataStoreState {
  BUILD = 'build',
  READY = 'ready',
  FETCHING = 'fetching',
  RESCHEDUAL = 'reschedual',
  ANALYSING = 'analysing',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface DataStore {
  serial: string;
  blueprint: string;

  type: DataStoreType;

  name: string;

  is_active: boolean;
  state: DataStoreState;

  fields: Field[];
  settings: DataStoreSettings;
  aggr: AggregationDataStoreConfig | null;
  web_service: WebServiceConfig | null;

  collaborators: string[]; // authors

  create_date: Date;
  last_modified: Date;
}

export interface SubDataStores {
  /** display name */
  name: string;
  data_store: string;
  on: {
    local_field: string;
    foreign_field: string;
  };
}

export interface DataStoreCardViewConfig {
  title: string;
  image: string | null;
  details: string[];
}

export interface DataStoreTreeViewItemConfig {
  field: string;
  display_field: string | null;
}

export interface DataStoreSettings {
  // General Settings
  // ------------------------------------------------------------------------------------
  // field used in UI when joining tables
  interface_field: string;
  card_view: DataStoreCardViewConfig | null;
  tree_view: DataStoreTreeViewItemConfig[] | null;
  // joins
  sub_data_stores: SubDataStores[];

  // table type only settings
  // ------------------------------------------------------------------------------------
  history: boolean;
  max_attachments_count: number;

  /**
   * ### workflow type
   *  - **false**: no workflow
   *  - **true**: default workflow where any admin can approve or reject
   *  - **string (workflow serial)**: predefined custom workflow
   * 
   * cannot be changed after build
   */
  workflow: string | boolean;
  /** When true
   * - records are inserted in blueprint level rather than instance level.
   * - inserting data will be made by other data stores.
   * 
   * cannot be changed after build
   */
  static: boolean;
}

export interface AggregationDataStoreConfig {
  from: string | null;
  pipeline: IAggrPiplineStage[];
};