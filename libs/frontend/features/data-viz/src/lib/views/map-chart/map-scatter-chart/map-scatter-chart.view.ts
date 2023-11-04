/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, booleanAttribute } from '@angular/core';
import { MapChartDataLoad } from '../map-chart.view';
import * as echarts from 'echarts';
import { MapScatterDataVizOptions, lerp } from '@pestras/shared/data-model';
import { generateMapGeoJson, recordToolTip } from '../../../util';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ToggleThemeService,
  mapStyle,
  mapStyleDark,
} from '@pestras/frontend/ui';
import 'echarts-extension-gmap';
import { ContraService } from '@pestras/frontend/util/contra';
import { Serial } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Component({
  selector: 'app-map-scatter-chart',
  template:
    '<div #chart *ngIf="(getIsDarkMode$() | async) as isDarkMode" echarts [options]="chartOptions" class="chart"></div>',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
     
      }
      .chart {
        height: 100%;
      }
    `,
  ],
})
export class MapScatterChartView implements OnChanges {
  mapSerial = Serial.gen('MAP');

  chartOptions!: echarts.EChartsOption;
  zoom = 12;
  center?: [number, number];

  @Input({ required: true })
  options!: MapScatterDataVizOptions;
  @Input({ required: true })
  payload!: MapChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;
  isDarkMode = false;

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(
    private contra: ContraService,
    private envServ: EnvService,
    private toggleThemeServ: ToggleThemeService
  ) {}

  public getIsDarkMode$(): Observable<echarts.EChartsOption[]> {
    return this.isDarkMode$.pipe(
      map((isDarkMode) => {
        return isDarkMode ? mapStyleDark : mapStyle;
      })
    );
  }

  ngOnChanges() {
    this.toggleThemeServ.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkModeSubject.next(isDarkMode);
    });

    if (this.payload.regions.length) {
      this.zoom = Math.max(...this.payload.regions.map((r) => r.zoom));

      if (this.payload.regions.length === 1) {
        const loc = this.payload.regions[0].location;
        this.center = [loc.lng, loc.lat];
      }
    }

    const map = generateMapGeoJson(this.payload.regions);
    const data = this.prepareData(this.options, this.payload);

    echarts.registerMap(this.mapSerial, map as any);
    this.render(this.options, data.list, data.effect, data.size);
  }

  prepareData(options: MapScatterDataVizOptions, data: MapChartDataLoad) {
    const list: number[][] = [];
    const effect: number[][] = [];
    const sizeField = data.fields.find((f) => f.name === options.size_field);
    const locField = data.fields.find((f) => f.name === options.loc_field);
    const valueField = data.fields.find((f) => f.name === options.value_field);
    let min = Infinity;
    let max = -Infinity;

    if (sizeField) {
      min = Math.min(...data.records.map((r) => r[sizeField.name] as number));
      max = Math.max(...data.records.map((r) => r[sizeField.name] as number));
    }

    if (!valueField)
      throw new Error(
        `value field not found (${options.value_field}): map scatter chart`
      );

    if (!locField)
      throw new Error(
        `loc field not found (${options.loc_field}): map scatter chart`
      );

    if (options.effect_start_value) {
      for (const r of data.records) {
        const value = r[valueField.name];

        if (value >= options.effect_start_value) {
          const record = [
            r[locField.name].lng,
            r[locField.name].lat,
            value,
            r['serial'] ?? r['_id'],
          ];

          if (sizeField) record.push(r[sizeField.name]);

          effect.push(record);
        }
      }
    }

    for (const r of data.records) {
      const record = [
        r[locField.name].lng,
        r[locField.name].lat,
        r[valueField.name],
        r['serial'] ?? r['_id'],
      ];

      if (sizeField) record.push(r[sizeField.name]);

      list.push(record);
    }

    // TODO: support for size field

    return { list, effect, size: sizeField ? { min, max } : null };
  }

  render(
    options: MapScatterDataVizOptions,
    list: number[][],
    effect: any[][],
    size: { min: number; max: number } | null
  ) {
    const series: any[] = [];
    const payload = this.payload;
    this.isDarkMode$.subscribe((isDarkMode) => {
      series.push({
        type: 'scatter',
        coordinateSystem: options.google_map ? 'gmap' : 'geo',
        geoIndex: 0,
        symbolSize: size
          ? function (params: number[]) {
              return lerp(params[2], [size.min, size.max], [10, 40]);
            }
          : 20,
        encode: {
          tooltip: 2,
        },
        label: { color: this.dark ? '#DDF' : '#335' },
        itemStyle: {
          shadowBlur: 1,
          shadowColor: '#111111',
        },
        data: list,
      });

      if (effect?.length > 0) {
        series.push({
          type: 'effectScatter',
          coordinateSystem: options.google_map ? 'gmap' : 'geo',
          geoIndex: 0,
          symbolSize: size
            ? function (params: number[]) {
                return lerp(params[2], [size.min, size.max], [10, 25]);
              }
            : 23,
          encode: {
            tooltip: 2,
          },
          itemStyle: {
            color: 'red',
            shadowBlur: 3,
            shadowColor: '#222222',
          },
          data: effect,
        });
      }

      const docsPath = this.envServ.env.docs;

      this.chartOptions = {
        textStyle: {
          fontFamily: 'Almarai',
        },
        tooltip: {
          backgroundColor: this.dark ? '#224' : '#FFF',
          className: 'card shadow-4 card-small ' + this.contra.currLang?.dir,
          renderMode: 'html',
          padding: 0,
          borderWidth: 0,
          borderRadius: 16,
          shadowBlur: 0,
          extraCssText: 'white-space: normal;',
          enterable: true,
          hideDelay: 100,
          showDelay: 100,
          formatter: function (param: any) {
            if (options.tooltip?.body.length) {
              const serial = param.value[3];
              const record = serial
                ? payload.records.find(
                    (r) => r['serial'] === serial || r['_id'] === serial
                  )
                : null;

              if (record)
                return recordToolTip(
                  payload.fields,
                  options.tooltip,
                  record,
                  docsPath
                );
            }

            return `${param.marker}\t<strong>${param.value[2]}</strong>`;
          },
        },
        gmap: options.google_map
          ? {
              center: this.center ?? [35.910937982131884, 31.96232549914046],
              zoom: this.zoom,
              renderOnMoving: true,
              echartsLayerZIndex: 2019,
              roam: true,
              styles: isDarkMode ? mapStyleDark : mapStyle,
              disableDefaultUI: false,
              keyboardShortcuts: false,
              fullscreenControl: false,
            }
          : null,
        visualMap: [
          {
            show: false,
            type: 'piecewise',
            min: 0,
            max: 100,
            dimension: 2, // the fourth dimension of series.data (i.e. value[3]) is mapped
            seriesIndex: 0, // The fourth series is mapped.
            inRange: {
              // The visual configuration in the selected range
              color: ['green', 'orange', 'red'], // A list of colors that defines the graph color mapping
            },
            outOfRange: {},
          },
          // ...
        ],
        geo: !options.google_map
          ? {
              tooltip: {
                show: true,
              },
              map: this.mapSerial,
              roam: true,
              label: {
                show: true,
              },
            }
          : undefined,
        series,
      };
    });
  }
}
