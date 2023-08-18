export interface EntityAccess {
  /** grant access to specific orgunits */
  orgunits: string[];
  /** grant access to specific users */
  users: string[];
  /** grant access to specific groups */
  groups: string[];
}