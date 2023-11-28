export interface DashboardViewSize {
  x: 3 | 4 | 6 | 8 | 9 | 12;
  y: 1 | 2;
}

export interface DashboardSlideView {
  serial: string;
  slide: string;
  title: string;
  data_viz: string;
  size: DashboardViewSize;
}

export interface DashboardSlide {
  serial: string;
  title: string;
  play_time: number;
  views_order: string[];

  //
  data_store: string;
}

export interface Dashboard {
  serial: string;
  topic: string | null;

  /** grant access to specific users */
  collaborators: string[];

  title: string;

  slides: DashboardSlide[];
  slides_order: string[];

  views: DashboardSlideView[];

  is_active: boolean;

  owner: string;

  create_date: Date;
  last_modified: Date;
}
