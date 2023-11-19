/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataVizAggrStage, DataVizTypes } from "../statistics";
import { IAggrPiplineStage } from "../util";
import { Field } from './fields';
import { WebServiceConfig } from './web-service';
import { WorkflowTriggers } from "./workflow";

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

  relations: SubDataStore[];
  collaborators: string[]; // authors

  create_date: Date;
  last_modified: Date;
}

// Relations
// ----------------------------------------------------------------------------------
export interface RelationChart<T = any> {
  aggregate: DataVizAggrStage[];
  type: DataVizTypes;
  options: T;
}

export interface SubDataStoreChart {
  serial: string;
  title: string;
  width: number;
  height: number;
  options: RelationChart;
}

export interface SubDataStore {
  serial: string;
  /** display name */
  name: string;
  data_store: string;
  on: {
    local_field: string;
    foreign_field: string;
  };
  charts: SubDataStoreChart[];
  charts_order: string[];
}

// Card View Config
// ----------------------------------------------------------------------------------
export interface DataStoreCardViewConfig {
  title: string;
  image: string | null;
  details: string[];
}

// Tree View Config
// ----------------------------------------------------------------------------------
export interface DataStoreTreeViewItemConfig {
  field: string;
  display_field: string | null;
}

/**
 * string: workflow name
 * true: by pass
 * false: not allowed
 * -----------------------------------------------------------------------------------
 */
export type WorkflowOptions = Record<WorkflowTriggers, string | boolean>;

export interface DataStoreSettings {
  // General Settings
  // ------------------------------------------------------------------------------------
  // field used in UI when joining tables
  primary_field: string | null;
  interface_field: string;
  card_view: DataStoreCardViewConfig | null;
  tree_view: DataStoreTreeViewItemConfig[] | null;

  // table type only settings
  // ------------------------------------------------------------------------------------
  history: boolean;
  max_attachments_count: number;

  /**
   * ### workflow type
   *  - **string (workflow serial)**: predefined custom workflow
   *  - **true**: by pass
   *  - **false**: not allowed
   * 
   * cannot be changed after build
   */
  workflow: Record<WorkflowTriggers, string | boolean>;
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