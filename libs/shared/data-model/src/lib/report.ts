export enum ReportViewType {
  RICH_TEXT = 'richText',
  IMAGE = 'image',
  VIDEO = 'video',
  ANALYSIS = 'analysis',
  DATA_VIZ = 'dataViz',
}

export interface ReportView {
    serial: string;
  slide: string;
  title: string | null;
  sub_title: string | null;
  type: ReportViewType;
  content: string;
}

export interface ReportSlide {
  serial: string;
  title: string;
  views_order: string[];
  data_store: string | null;
}

export interface Report {
  serial: string;
  topic: string;

  /** grant access to specific users */
  collaborators: string[];

  title: string;

  slides: ReportSlide[];
  slides_order: string[];

  views: ReportView[];

  is_active: boolean;

  owner: string;

  create_date: Date;
  last_modified: Date;
}
