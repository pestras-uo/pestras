/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import {
  BaseDataViz,
  HeatmapDataPoint,
  HeatmapDataVizOptions,
} from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-heatmap-chart',
  template: `
    <div
      *ngIf="chartOptions"
      echarts
      [options]="chartOptions"
      class="chart"
    ></div>
  `,
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
export class HeatmapChartView implements OnChanges {
  chartOptions!: EChartsOption;

  @Input() conf!: BaseDataViz<HeatmapDataVizOptions>;
  @Input() data!: ChartDataLoad;
  @Input() dark = false;

  ngOnChanges() {
    this.renderHeatmap(this.init(this.conf.options));
  }

  init(options: HeatmapDataVizOptions) {
    const xField = this.data.fields.find(
      (f) => f.name === options.x_axis_field
    );
    const yField = this.data.fields.find(
      (f) => f.name === options.y_axis_field
    );

    if (!xField) {
      throw new Error(
        `x-axis field not found (${options.x_axis_field}): heatmap chart`
      );
    }

    if (!yField) {
      throw new Error(
        `y-axis field not found (${options.y_axis_field}): heatmap chart`
      );
    }

    return this.data.records.map((record) => ({
      xValue: record[xField.name] ?? xField.display_name,
      yValue: record[yField.name] ?? xField.display_name,
      value: record[options.value_field],
    }));
  }

  renderHeatmap(data: HeatmapDataPoint[]) {
    const xValues = data.map((item: HeatmapDataPoint) => item.xValue);
    const yValues = data.map((item: HeatmapDataPoint) => item.yValue);
    const cellValues = data.map((item: HeatmapDataPoint) => item.value);

    this.chartOptions = {
      xAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
        data: [...new Set(xValues)] as string[],
        axisLabel: {
          color: this.dark ? '#DDF' : '#335',

          rotate: -45,
        },
      },
      yAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: this.dark ? '#DDF' : '#335',
          rotate: 0,
        },
        data: [...new Set(yValues)] as string[],
      },
      visualMap: {
        min: Math.min(...cellValues),
        max: Math.max(...cellValues),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top',
        inRange: {
          color: ['#e0ffff', '#006edd'],
        },
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return ` ${params.value[0]} : ${params.value[2]}`;
        },
      },
      grid: {
        height: '50%',
        bottom: '30%',
        left: '15%',
        right: '10%',
      },
      series: data.map((item: HeatmapDataPoint) => ({
        type: 'heatmap',
        data: [[item.xValue, item.yValue, item.value]],
        label: {
          show: true,
        },
        // itemStyle: {
        //   color: new graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: '#FF0000' },
        //     { offset: 0.5, color: '#00FF00' },
        //     { offset: 1, color: '#0000FF' },
        //   ]),
        // },
      })),
    };
  }
}
