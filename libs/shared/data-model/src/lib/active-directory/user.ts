import { Role } from "./role";

export enum UserState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BY_PASS = 'by_pass'
}

export interface User {
  serial: string;
  orgunit: string; // serial
  // unique
  username: string;

  roles: Role[];
  /** 
   * can create admin users on same orgunit
   *  - applicable on admin users only
   */
  is_super: boolean;
  /** users can take responsibility when user inactive */
  alternatives: string[];
  groups: string[];

  /**
   * ### User State
   *  - **active**: default state.
   *  - **inactive**: user can't make any action even loging in into the system.
   *  - **by_bass**: workflow events will be shifted to alternatives when any were found.
   */
  state: UserState;
  
  avatar?: string | null; // image

  fullname: string;
  email: string | null;
  mobile: string | null;
  
  create_date: Date;
  last_modified: Date;
}