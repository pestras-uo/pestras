export interface GisMapComponentConfig {
  id: string;
  portal: string;
  basemap: string;
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