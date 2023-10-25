/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, booleanAttribute } from '@angular/core';
import { MapChartDataLoad } from '../map-chart.view';
import * as echarts from 'echarts';
import { DataRecord, MapPieDataVizOptions } from '@pestras/shared/data-model';
import { generateMapGeoJson } from '../../../util';
import { RegionsState } from '@pestras/frontend/state';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-map-pie-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class MapPieChartView implements OnChanges {
  mapSerial = Serial.gen("MAP");

  chartOptions!: echarts.EChartsOption;

  @Input({ required: true })
  options!: MapPieDataVizOptions;
  @Input({ required: true })
  payload!: MapChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  constructor(private regionsState: RegionsState) {}

  ngOnChanges() {
    const map = generateMapGeoJson(this.payload.regions);
    const data = this.init(this.options);

    echarts.registerMap(this.mapSerial, map as any);
    this.render(data);
  }

  init(options: MapPieDataVizOptions) {
    const valueField = this.payload.fields.find(f => f.name === options.value_field);
    const catField = this.payload.fields.find(f => f.name === options.category_field);
    const regionField = this.payload.fields.find(f => f.name === options.region_field);

    if (!valueField)
      throw new Error(`value field not found (${options.value_field}): map pie chart`);

    if (!catField)
      throw new Error(`category field not found (${options.category_field}): map pie chart`);

    if (!regionField)
      throw new Error(`region field not found (${options.region_field}): map pie chart`);

    const regionsData = new Map<string, DataRecord[]>();

    for (const r of this.payload.records) {
      if (!regionsData.has(r[regionField.name] as string))
        regionsData.set(r[regionField.name] as string, [r])
      else
        regionsData.get(r[regionField.name] as string)?.push(r);
    }

    return [...regionsData.entries()].map(([region, records]) => {
      return {
        type: 'pie',
        name: valueField.display_name,
        coordinateSystem: 'geo',
        tooltip: {
          backgroundColor: this.dark ? '#224' : '#FFF',
          formatter: '{b}: {c} ({d}%)'
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        animationDuration: 0,
        radius: 30,
        center: this.getRegionLocation(region),
        data: records.map(r => ({ name: r[catField.name], value: r[valueField.name] }))
      } as echarts.PieSeriesOption;
    })
  }

  getRegionLocation(regionName: string) {
    const loc = this.regionsState.get(r => r.name === regionName)?.location;

    return loc ? [loc.lng, loc.lat] : [];
  }

  render(series: echarts.PieSeriesOption[]) {
    this.chartOptions = {
      textStyle: {
        fontFamily: 'Almarai'
      },
      geo: {
        map: this.mapSerial,
        roam: true,
        itemStyle: {
          areaColor: '#e7e8ea'
        },
        label: {
          show: true,
          color: this.dark ? '#DDF' : '#335'
        }
      },
      tooltip: {
        backgroundColor: this.dark ? '#224' : '#EEF'
      },
      legend: {},
      series
    }
  }
}