import { GeoLocation } from "@pestras/shared/util";

export interface RegionCoords {
  type: "Polygon" | "MultiPolygons";
  coordinates: { lat: number; lng: number }[][];
}

export interface GISMapFeatureLayer {
  serial: string;
  name: string;
  id: string | null;
  url: string | null;
}

export interface GISMapConfig {
  serial: string;
  name: string;
  apiKey: string | null;
  id: string;
  portal: string;
  basemap: string;
  layers: GISMapFeatureLayer[];
}

export interface Region {
  serial: string;
  name: string;
  type: string;
  location: GeoLocation;
  zoom: number;
  coords: RegionCoords | null;
  gis: GISMapConfig[];

  create_date: Date;
  last_modified: Date;
}

export * from './api';