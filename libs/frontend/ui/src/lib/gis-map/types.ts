export interface GisMapComponentConfig {
  basemap: string;
  id?: string | null;
  portal?: string | null;
  apiKey?: string | null;
}

export interface GisMapLayer {
  id?: string | null;
  url?: string | null;
}

export interface GisMapView {
  center: number[];
  zoom: number;
}