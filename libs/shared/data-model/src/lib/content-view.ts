export enum ContentViewType {
  RICH_TEXT = 'richText',
  IMAGE = 'image',
  VIDEO = 'video'
}

export interface ContentView {
  serial: string;
  title: string | null;
  sub_title: string | null;
  type: ContentViewType;
  content: string | null;
}

export interface EntityContentViews {
  entity: string;

  views: ContentView[];
  views_order: string[];
}