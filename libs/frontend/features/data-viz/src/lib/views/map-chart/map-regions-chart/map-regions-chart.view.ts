/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MapChartDataLoad } from '../map-chart.view';
import * as echarts from 'echarts';
import { MapRegionsDataVizOptions } from '@pestras/shared/data-model';
import { generateMapGeoJson } from '../../../util';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-map-regions-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapRegionsChartView implements OnChanges {
  serial = Serial.gen("MAP");

  chartOptions!: echarts.EChartsOption;

  @Input({ required: true })
  options!: MapRegionsDataVizOptions;
  @Input({ required: true })
  payload!: MapChartDataLoad;

  ngOnChanges() {
    const map = generateMapGeoJson(this.payload.regions);
    const data = this.init(this.options);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    echarts.registerMap(this.serial, map as any)
    this.render(this.options, data);
  }

  init(options: MapRegionsDataVizOptions) {
    const valueField = this.payload.fields.find(f => f.name === options.value_field);

    if (!valueField)
      throw new Error(`value field not found (${options.value_field}): map regions chart`);

    const regionField = this.payload.fields.find(f => f.name === options.region_field);

    if (!regionField)
      throw new Error(`region field not found (${options.region_field}): map regions chart`);
      
    return this.payload.records.map(r => ({ name: r[regionField.name] as string, value: r[valueField.name] as number }));
  }

  render(options: MapRegionsDataVizOptions, data: { name: string; value: number; }[]) {
    this.chartOptions = {
      textStyle: {
        fontFamily: 'Almarai'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c}'
      },
      visualMap: {
        min: Math.min(...data.map(d => d.value)),
        max: Math.max(...data.map(d => d.value)),
        // text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: options.color_range
        }
      },
      series: [
        {
          type: 'map',
          map: this.serial,
          label: {
            show: true
          },
          data
        }
      ]
    }
  }
}