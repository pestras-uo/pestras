/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnChanges } from "@angular/core";
import { BaseDataViz, GISMapConfig, GISMapDataVizLayerOptions, GISMapDataVizOptions, Region, TypesNames } from "@pestras/shared/data-model";
import { ChartDataLoad } from "../../util";
import { RegionsState } from "@pestras/frontend/state";
import { GisMapComponentConfig, GisMapLayer, GisMapView } from "@pestras/frontend/ui";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import PieChartRenderer from "@arcgis/core/renderers/PieChartRenderer";

@Component({
  selector: 'pestras-gis-map-viz',
  template: `
    <pui-gis-map 
      *ngIf="ready"
      [config]="mapConfig" 
      [view]="mapView" 
      [layers]="layers"
      legend
      [customLayers]="customLayers">
    </pui-gis-map>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class GisMapVizComponent implements OnChanges {
  region!: Region;
  regionMap!: GISMapConfig;
  mapConfig!: GisMapComponentConfig;
  mapView!: GisMapView;
  layers: GisMapLayer[] = [];
  options!: GISMapDataVizOptions;
  customLayers: FeatureLayer[] = [];
  ready = false;

  @Input({ required: true })
  conf!: Pick<BaseDataViz<any>, 'aggregate' | 'options' | 'type'>;
  @Input({ required: true })
  data!: ChartDataLoad;

  constructor(
    private regionsState: RegionsState
  ) { }

  ngOnChanges(): void {
    this.ready = false;
    this.options = this.conf.options;
    this.layers = [];
    this.customLayers = [];

    this.initBaseMap();
    this.initView();
    this.initLayers();
    this.initCustomLayers();
    this.ready = true;
  }

  private initBaseMap() {
    const region = this.regionsState.get(this.options.region);

    if (!region)
      throw `base map region not found: ${this.options.region}`;

    this.region = region;

    const map = region.gis.find(m => m.serial === this.options.map);

    if (!map)
      throw `base map config not found: ${this.options.map}`;

    this.regionMap = map;

    this.mapConfig = {
      basemap: map.basemap,
      id: map.id,
      portal: map.portal,
      apiKey: map.apiKey
    };
  }

  private initView() {
    this.mapView = {
      center: [this.region.location.lng, this.region.location.lat],
      zoom: this.region.zoom
    }
  }

  private initLayers() {
    for (const l of this.options.layers) {
      const layer = this.regionMap.layers.find(la => la.serial === l);

      if (!layer)
        continue;

      this.layers.push({ id: layer.id, url: layer.url });
    }

    for (const l of this.options.external_layers)
      this.layers.push({ url: l.url });
  }

  private initCustomLayers() {
    if (this.options.custom_layers.length === 0)
      return;

    const layerOptions = this.options.custom_layers[0];

    const layers = layerOptions.type === 'point'
      ? this.initPointsLayer(layerOptions)
      : layerOptions.type === 'polygon'
        ? this.initPolygonsLayer(layerOptions)
        : this.initPiesLayer(layerOptions);

    this.customLayers.push(...layers);
  }

  private initPointsLayer(opt: GISMapDataVizLayerOptions) {
    const locField = opt.location_field as string;
    const minMaxSize = [Infinity, -Infinity];
    const minMaxOpacity = [Infinity, -Infinity];
    let maxColorValue = -Infinity;
    const symbol = new SimpleMarkerSymbol({ color: '#4466CC', size: 20, outline: { color: '#ffffff', width: 1.2 } });
    const graphics = this.data.records.map((r) => {

      const attributes: any = {
        [opt.primary_field]: r[opt.primary_field],
        [opt.title_field]: r[opt.title_field]
      };

      for (const f of opt.details_fields)
        attributes[f] = r[f];

      if (opt.size_field) {
        attributes[opt.size_field] = r[opt.size_field];
        minMaxSize[0] = Math.min(minMaxSize[0], r[opt.size_field] ?? Infinity);
        minMaxSize[1] = Math.max(minMaxSize[1], r[opt.size_field] ?? -Infinity);
      }

      if (opt.opacity_field) {
        attributes[opt.opacity_field] = r[opt.opacity_field];
        minMaxOpacity[0] = Math.min(minMaxOpacity[0], r[opt.opacity_field] ?? Infinity);
        minMaxOpacity[1] = Math.max(minMaxOpacity[1], r[opt.opacity_field] ?? -Infinity);
      }

      if (opt.color_field) {
        attributes[opt.color_field] = r[opt.color_field];
        maxColorValue = Math.max(maxColorValue, r[opt.color_field]);
      }

      return new Graphic({
        attributes,
        geometry: new Point({ longitude: r[locField].lng, latitude: r[locField].lat })
      });
    });

    const objectIdField = opt.primary_field;
    const visualVariables: any[] = [];
    const fields: any[] = [{
      name: objectIdField,
      alias: objectIdField,
      type: "oid"
    }, {
      name: opt.title_field,
      alias: opt.title_field,
      type: "string"
    }];

    for (const f of opt.details_fields) {
      const field = this.data.fields.find(fi => fi.name === f);

      if (field)
        fields.push({
          name: field.name,
          alias: field.name,
          type: this.mapType(field.type)
        });
    }

    if (opt.size_field) {
      const field = this.data.fields.find(fi => fi.name === opt.size_field);

      if (field) {
        fields.push({ name: opt.size_field, alias: opt.size_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'size',
          field: opt.size_field,
          minDataValue: minMaxSize[0],
          maxDataValue: minMaxSize[1],
          minSize: 8,
          maxSize: 40
        })
      }
    }

    if (opt.color_field) {
      const field = this.data.fields.find(fi => fi.name === opt.color_field);

      if (field) {
        fields.push({ name: opt.color_field, alias: opt.color_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'color',
          valueExpression: `$feature.${opt.color_field} / ${maxColorValue} * 100`,
          stops: opt.color_range
        });
      }
    }

    if (opt.opacity_field) {
      const field = this.data.fields.find(fi => fi.name === opt.opacity_field);

      if (field) {
        fields.push({ name: opt.opacity_field, alias: opt.opacity_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'opacity',
          valueExpression: `$feature.${opt.opacity_field} / ${minMaxOpacity[1]} * 100`,
          stops: [
            { value: minMaxOpacity[0], opacity: 0.1 },
            { value: minMaxOpacity[1], opacity: 1 }
          ]
        });
      }
    }

    return [new FeatureLayer({
      source: graphics,
      objectIdField,
      renderer: new SimpleRenderer({ symbol, visualVariables }),
      fields,
      popupTemplate: new PopupTemplate({
        title: `{${opt.title_field}}`,
        content: [{
          type: 'fields',
          fieldInfos: opt.details_fields.map(f => {
            const field = this.data.fields.find(fi => fi.name === f);

            return { fieldName: f, label: field?.display_name ?? f };
          })
        }]
      }),
      featureReduction: {
        type: 'cluster',
        clusterRadius: "100px",
        clusterMinSize: "24px",
        clusterMaxSize: "60px",
        labelingInfo: [{
          deconflictionStrategy: "none",
          labelExpressionInfo: {
            expression: "Text($feature.cluster_count, '#,###')"
          },
          symbol: {
            type: "text",
            color: "#FFFFFF",
            font: {
              weight: "bold",
              family: "Noto Sans",
              size: "12px"
            }
          },
          labelPlacement: "center-center",
        }]
      }
    })];
  }

  private initPolygonsLayer(opt: GISMapDataVizLayerOptions) {
    const minMaxOpacity = [Infinity, -Infinity];
    let maxColorValue = -Infinity;
    const symbol = new SimpleFillSymbol({
      color: 'orange',
      outline: {
        width: 1.5,
        color: [255, 255, 255, 0.8]
      }
    });
    const graphics = this.data.records.map(r => {

      const attributes: any = {
        [opt.primary_field]: r[opt.primary_field],
        [opt.title_field]: r[opt.title_field]
      };

      for (const f of opt.details_fields)
        attributes[f] = r[f];

      if (opt.opacity_field) {
        attributes[opt.opacity_field] = r[opt.opacity_field];
        minMaxOpacity[0] = Math.min(minMaxOpacity[0], r[opt.opacity_field] ?? Infinity);
        minMaxOpacity[1] = Math.max(minMaxOpacity[1], r[opt.opacity_field] ?? -Infinity);
      }

      if (opt.color_field) {
        attributes[opt.color_field] = r[opt.color_field];
        maxColorValue = Math.max(maxColorValue, r[opt.color_field]);
      }

      let region: Region | null;
      if (opt.region_field) {
        attributes[opt.region_field] = r[opt.region_field];
        region = this.regionsState.get(r[opt.region_field]) ?? null;

        if (!region || !region.coords)
          return null;

        attributes['region_name'] = region.name;

      } else
        return null;

      return new Graphic({
        attributes,
        geometry: new Polygon({ rings: [region.coords?.coordinates[0].map(c => [c.lng, c.lat])] })
      })
    }).filter(Boolean) as Graphic[];

    const objectIdField = opt.primary_field;
    const visualVariables: any[] = [];

    const fields: any[] = [{
      name: objectIdField,
      alias: objectIdField,
      type: "oid"
    }, {
      name: opt.title_field,
      alias: opt.title_field,
      type: "string"
    }];

    for (const f of opt.details_fields) {
      const field = this.data.fields.find(fi => fi.name === f);

      if (field)
        fields.push({
          name: field.name,
          alias: field.name,
          type: this.mapType(field.type)
        });
    }

    if (opt.color_field) {
      const field = this.data.fields.find(fi => fi.name === opt.color_field);

      if (field) {
        fields.push({ name: opt.color_field, alias: opt.color_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'color',
          valueExpression: `$feature.${opt.color_field} / ${maxColorValue} * 100`,
          stops: opt.color_range
        });
      }
    }

    if (opt.opacity_field) {
      const field = this.data.fields.find(fi => fi.name === opt.opacity_field);

      if (field) {
        fields.push({ name: opt.opacity_field, alias: opt.opacity_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'opacity',
          valueExpression: `$feature.${opt.opacity_field}`,
          stops: [
            { value: minMaxOpacity[0], opacity: 0.1 },
            { value: minMaxOpacity[1], opacity: 1 }
          ]
        });
      }
    }

    return [new FeatureLayer({
      source: graphics,
      objectIdField,
      fields,
      renderer: new SimpleRenderer({ symbol, visualVariables }),
      popupTemplate: new PopupTemplate({
        title: `{${opt.title_field}}`,
        content: [{
          type: 'fields',
          fieldInfos: opt.details_fields.map(f => {
            const field = this.data.fields.find(fi => fi.name === f);

            return { fieldName: f, label: field?.display_name ?? f };
          })
        }]
      }),
      labelingInfo: [{
        symbol: new TextSymbol({
          color: '#333333',
          font: {  // autocasts as new Font()
            size: 10,
            weight: 'bold'
          },
        }),
        labelExpressionInfo: {
          expression: `$feature.${opt.title_field}`
        }
      }]
    })
    ];
  }

  private initPiesLayer(opt: GISMapDataVizLayerOptions) {
    const minMaxSize = [Infinity, -Infinity];
    const graphics = this.data.records.map(r => {
      const attributes: any = {
        [opt.primary_field]: r[opt.primary_field],
        [opt.title_field]: r[opt.title_field]
      };

      for (const f of opt.details_fields)
        attributes[f] = r[f];

      for (const f of opt.pie_fields)
        attributes[f.field] = r[f.field];

      let region: Region | null;
      if (opt.region_field) {
        attributes[opt.region_field] = r[opt.region_field];
        region = this.regionsState.get(r[opt.region_field ?? '']) ?? null;

        if (!region || !region.coords)
          return null;

        attributes['region_name'] = region.name;

      } else
        return null;

      if (opt.size_field) {
        attributes[opt.size_field] = r[opt.size_field];
        minMaxSize[0] = Math.min(minMaxSize[0], r[opt.size_field] ?? Infinity);
        minMaxSize[1] = Math.max(minMaxSize[1], r[opt.size_field] ?? -Infinity);
      }

      return new Graphic({
        attributes,
        // symbol,
        geometry: new Polygon({ rings: [region.coords?.coordinates[0].map(c => [c.lng, c.lat])] })
      });
    }).filter(Boolean) as Graphic[];

    const objectIdField = opt.primary_field;
    const visualVariables: any[] = [];

    const fields: any[] = [{
      name: objectIdField,
      alias: objectIdField,
      type: "oid"
    }, {
      name: opt.title_field,
      alias: opt.title_field,
      type: "string"
    }];

    for (const f of opt.details_fields) {
      const field = this.data.fields.find(fi => fi.name === f);

      if (field)
        fields.push({
          name: field.name,
          alias: field.name,
          type: this.mapType(field.type)
        });
    }

    for (const f of opt.pie_fields) {
      const field = this.data.fields.find(fi => fi.name === f.field);

      if (field)
        fields.push({
          name: field.name,
          alias: field.name,
          type: this.mapType(field.type)
        });
    }

    if (opt.size_field) {
      const field = this.data.fields.find(fi => fi.name === opt.size_field);

      if (field) {
        fields.push({ name: opt.size_field, alias: opt.size_field, type: this.mapType(field.type) });

        visualVariables.push({
          type: 'size',
          field: opt.size_field,
          minDataValue: minMaxSize[0],
          maxDataValue: minMaxSize[1],
          minSize: 30,
          maxSize: 50
        });
      }
    }

    const renderer = new PieChartRenderer({
      size: 12,
      attributes: opt.pie_fields.map(f => {
        const field = this.data.fields.find(fi => fi.name === f.field);

        return {
          color: f.color,
          field: f.field,
          label: field?.display_name ?? f.field
        }
      }),
      backgroundFillSymbol: { // polygon fill behind pie chart
        color: [127, 127, 127, 0.1],
        outline: {
          width: 1,
          color: [0, 0, 0, 0.4]
        }
      },
      outline: {
        width: 1.5,
        color: "white"
      },
      visualVariables
    });

    return [new FeatureLayer({
      source: graphics,
      fields,
      objectIdField,
      renderer,
      popupTemplate: new PopupTemplate({
        title: `{${opt.title_field}}`,
        content: [{
          type: 'fields',
          fieldInfos: opt.details_fields.map(f => {
            const field = this.data.fields.find(fi => fi.name === f);

            return { fieldName: f, label: field?.display_name ?? f };
          })
        }]
      }),
      labelingInfo: [{
        symbol: new TextSymbol({
          color: '#333',
          font: {  // autocasts as new Font()
            size: 10,
            weight: 'bold'
          },
          yoffset: 30
        }),
        labelExpressionInfo: {
          expression: `$feature.${opt.title_field}`
        }
      }]
    })];
  }

  private mapType(type: TypesNames) {
    switch (type) {
      case 'int':
        return 'integer';
      case 'double':
        return 'double';
      case 'date':
      case 'datetime':
        return 'date';
      default:
        return 'string';
    }
  }
}