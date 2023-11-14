/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import {
  BaseDataViz,
  DataVizTypes,
  Field,
  HeatmapDataVizOptions,
} from '@pestras/shared/data-model';
import { Component, Input, OnChanges, booleanAttribute } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { ChartDataLoad } from '../../util';

const colors = [
  ['#83bff6', '#188df0', '#188df0'],
  ['#83e6af', '#18e08d', '#18e08d'],
  ['#e683af', '#e0188d', '#e0188d'],
  ['#e6af83', '#e08d18', '#e08d18'],
  ['#bf83f6', '#d818f0', '#d818f0'],
  ['#83afe6', '#188de0', '#188de0'],
];

@Component({
  selector: 'app-heatmap-chart',
  template:
    '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
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

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  ngOnChanges() {
    const { categories, series, valueFields } = this.init(
      this.conf.options as HeatmapDataVizOptions
    );
    this.render(
      this.conf.options as HeatmapDataVizOptions,
      categories as string[],
      series,
      valueFields as Field[]
    );
  }
  private init(options: HeatmapDataVizOptions) {
    const catField = this.data.fields.find((f) => f.name === options.row_field);
    const valueFields = [options.value_field].map((vf) =>
      this.data.fields.find((f) => f.name === vf)
    );

    if (!catField) {
      throw new Error(
        `category field not found (${options.row_field}): heatmap chart`
      );
    }

    if (!valueFields[0]) {
      throw new Error(
        `value field not found (${options.value_field}): heatmap chart`
      );
    }
    const categories = this.data.records.map((r) => r[catField.name]);
    const series = valueFields.map((vf, i) => {
      const data = this.data.records
        .map((r, index) => [index, i, vf ? r[vf.name] : null])
        .filter((val) => val[2] !== null);

      return {
        type: 'heatmap',
        data,
      };
    });

    return { categories, series, valueFields };
  }

  render(
    options: HeatmapDataVizOptions,
    categories: string[],
    series: any[],
    valueFields: Field[]
  ) {
    const labelOptions: any = {
      show: true,
      formatter: function (param: any) {
        return '' + Math.round(+param.value[2]);
      },
      fontSize: 16,
      color: this.dark ? '#DDF' : '#335',
    };

    if (options.heatmap_orientation === 'horizontal') {
      labelOptions.position = [10, '25%'];
    } else {
      labelOptions.align = 'left';
      labelOptions.rotate = 90;
      labelOptions.verticalAlign = 'middle';
      labelOptions.position = 'insideBottom';
      labelOptions.distance = 15;
    }

    this.chartOptions = {
      textStyle: { fontFamily: 'Almarai' },
      tooltip: {
        trigger: 'item',
        formatter: function (param: any) {
          return `
            <h4>${param.seriesName}</h4>
            <p>${param.marker} <span style='margin-inline-end: 28px'>${
            param.name
          }</span> <strong>${Math.round(+param.value[2])}</strong></p>
          `;
        },
        backgroundColor: this.dark ? '#224' : '#FFF',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend:
        series.length > 1
          ? {
              textStyle: {
                color: this.dark ? '#DDF' : '#335',
              },
            }
          : undefined,
      grid: {
        top: series.length > 1 ? '8%' : '3%',
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: options.heatmap_orientation?.includes('horizontal')
        ? {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 45,
              color: this.dark ? '#DDF' : '#335',
            },
          }
        : {
            type: 'category',
            data: categories,
            axisLabel: {
              color: this.dark ? '#DDF' : '#335',
            },
          },
      yAxis: !options.heatmap_orientation?.includes('vertical')
        ? {
            type: 'category',
            data: categories,
            axisLabel: {
              color: this.dark ? '#DDF' : '#335',
            },
          }
        : undefined,
      visualMap: {
        type: 'continuous',
        min: Math.min(...this.data.records.map((r) => r[valueFields[0].name])), // Assuming you're using only the first valueField
        max: Math.max(...this.data.records.map((r) => r[valueFields[0].name])), // Assuming you're using only the first valueField
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: this.dark ? ['#DDF', '#335'] : ['#335', '#DDF'],
        },
      },

      series: series.map((s, i) => ({
        ...s,
        label: labelOptions,
        emphasis: {
          itemStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[i][2] },
              { offset: 0.7, color: colors[i][1] },
              { offset: 1, color: colors[i][0] },
            ]),
          },
        },
      })),
    };
  }
}
