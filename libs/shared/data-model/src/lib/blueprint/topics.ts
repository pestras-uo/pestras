export interface Topic {
  serial: string;
  blueprint: string;
  parent: string | null;
  
  name: string;
  
  owner: string;

  create_date: Date;
  last_modified: Date;
}