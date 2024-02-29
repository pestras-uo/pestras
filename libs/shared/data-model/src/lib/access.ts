export interface EntityAccess {
  /** topic, dashboard or report */
  entity: string;
  /** allow guest accenss */
  allow_guests: boolean;
  /** grant access to specific orgunits */
  orgunits: string[];
  /** grant access to specific users */
  users: string[];
  /** grant access to specific groups */
  groups: string[];
}