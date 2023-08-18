export interface EntityView {
  /** One to one relation no need for serial */
  entity: string;
  views: { user: string; date: Date; }
}