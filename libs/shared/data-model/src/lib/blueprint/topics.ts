import { EntityAccess } from "../active-directory/access"; 

export interface Topic {
  serial: string;
  blueprint: string;
  parent: string | null;
  
  name: string;
  
  access: EntityAccess;

  owner: string;

  create_date: Date;
  last_modified: Date;
}