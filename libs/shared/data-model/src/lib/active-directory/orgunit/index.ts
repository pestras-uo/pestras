export interface Orgunit {
  serial: string; 
  name: string;
  is_partner: boolean;
  logo: string | null;
  regions: string[];
  class: string;
  create_date: Date;
  last_modified: Date;
}

export * from './api';