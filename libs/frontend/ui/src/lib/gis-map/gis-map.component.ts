/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, booleanAttribute } from "@angular/core";
import { GisMapComponentConfig, GisMapLayer, GisMapView } from "./types";
import GISConfig from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LegendWidget from '@arcgis/core/widgets/Legend';
import { Serial } from "@pestras/shared/util";

@Component({
  selector: 'pui-gis-map',
  template: '<div [id]="mapId" class="w-fit h-fit p-0 m-0"></div>',
  styles: [`:host { display: block; height: 100%; }`]
})
export class PuiGisMapComponent implements OnChanges, AfterViewInit {
  readonly mapId = Serial.gen("MID");
  map!: WebMap;
  mapView!: MapView;
  extraLayers: FeatureLayer[] = [];

  @Input({ required: true })
  config!: GisMapComponentConfig
  @Input({ required: true })
  view!: GisMapView;
  @Input()
  layers: GisMapLayer[] = [];
  @Input()
  customLayers: FeatureLayer[] = [];
  @Input({ transform: booleanAttribute })
  legend = false;

  ngOnChanges(c: SimpleChanges): void {

    if (this.map) {
      if (c['config'])
        this.createMap();

      if (c['layers'] || this.customLayers.length)
        this.updateLayers();
    }
  }

  ngAfterViewInit(): void {
    this.createMap(this.layers.length > 0 || this.customLayers.length > 0);
  }

  createMap(updateLayers = false) {
    GISConfig.apiKey = this.config.apiKey || '';

    this.map = new WebMap({
      portalItem: this.config.id
        ? { id: this.config.id, portal: { url: this.config.portal ?? undefined } }
        : undefined,
      basemap: this.config.basemap
    });

    this.mapView = new MapView({
      container: this.mapId,
      center: this.view.center,
      zoom: this.view.zoom,
      map: this.map
    });

    if (updateLayers)
      this.updateLayers();

    if (this.legend) {
      const legend = new LegendWidget({ view: this.mapView });

      this.mapView.ui.add(legend, 'bottom-left');
    }
  }

  updateLayers() {
    const layers = this.layers.map(l => new FeatureLayer({ url: l.url ?? undefined, id: l.id ?? undefined }));

    if (this.customLayers.length)
      layers.push(...this.customLayers);

    this.map.layers.removeMany(this.extraLayers);
    this.extraLayers = layers;
    this.map.layers.addMany(layers);
  }
}