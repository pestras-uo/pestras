export interface Orgunit {
  serial: string; 
  name: string;
  logo: string | null;
  regions: string[];
  class: string;
  create_date: Date;
  last_modified: Date;
}