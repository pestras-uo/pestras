import { GeoLocation } from "@pestras/shared/util";

export interface RegionCoords {
  type: "Polygon" | "MultiPolygons";
  coordinates: { lat: number; lng: number }[][];
}

export interface Region {
  serial: string;
  name: string;
  type: string;
  location: GeoLocation;
  zoom: number;
  coords: RegionCoords | null;

  create_date: Date;
  last_modified: Date;
}