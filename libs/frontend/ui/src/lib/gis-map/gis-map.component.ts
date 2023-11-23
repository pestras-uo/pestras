/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { GisMapComponentConfig, GisMapLayer, GisMapView } from "./types";
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { Serial } from "@pestras/shared/util";

@Component({
  selector: 'pui-gis-map',
  template: '<div [id]="mapId" class="w-fit h-fit"></div>'
})
export class PuiGisMapComponent implements OnChanges {
  readonly mapId = Serial.gen("MID");
  map!: WebMap;
  mapView!: MapView;

  @Input({ required: true })
  config!: GisMapComponentConfig
  @Input({ required: true })
  view!: GisMapView;
  @Input()
  layers: GisMapLayer[] = [];

  ngOnChanges(c: SimpleChanges): void {
    if (c['config'])
      this.createMap();
  }

  createMap() {
    this.map = new WebMap({
      portalItem: {
        apiKey: this.config.apiKey || '',
        id: this.config.id,
        portal: { url: this.config.portal }
      },
      basemap: this.config.basemap
    });

    this.mapView = new MapView({
      container: this.mapId,
      center: this.view.center,
      zoom: this.view.zoom
    });
  }

  updateLayers() {
    this.map.layers.removeAll();
    this.map.layers
      .addMany(this.layers.map(l => new FeatureLayer({ url: l.url ?? undefined, id: l.id ?? undefined })));
  }
}