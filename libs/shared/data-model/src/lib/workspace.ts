export enum WorkspacePinType {
  DATA_STORES = 'data_stores',
  TOPICS = 'topics',
  BLUEPRINTS = 'blueprints',
  DASHBOARDS = 'dashboards',
  REPORTS = 'reports'
}

export interface WorkspacePin {
  serial: string;
  name: string | null;
  type: WorkspacePinType;
  scope: string | null; // for dashboards, reports and topics types 
  group: string;
}

export interface WorkspaceDashboardSlide {
  name: string;
  slide: string;
  dashboard: string;
  scope: string;
}

export interface WorkspaceGroup {
  serial: string;
  name: string;
}

// no need for serial since it is a one to one relation
export interface Workspace {
  owner: string;
  groups: WorkspaceGroup[];
  pins: WorkspacePin[];
  slides: WorkspaceDashboardSlide[];
}