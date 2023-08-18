export interface Blueprint {
  serial: string;
  name: string;

  orgunit: string;
  /** Main Data engineer */
  owner: string;

  /** data engineers */
  collaborators: string[];

  create_date: Date;
  last_modified: Date;
}

export * from './topics';
export * from './data-store';
export * from './category';
export * from './web-service';
export * from './fields';
export * from './fields/sys-fields';
export * from './records';
export * from './workflow';
export * from './client_api';