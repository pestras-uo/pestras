/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { BaseDataViz, DataRecord, HierarchicalDataVizOptions } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { Hierarchical, toHierarchy } from '@pestras/shared/util';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-hierarchical-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class HierarchicalChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const { hierarchy, minMax } = this.prepareData(this.conf.options, this.data.records);

    this.render(hierarchy, minMax, this.conf.options.color_range ?? [])
  }

  prepareChart(options: HierarchicalDataVizOptions, data: DataRecord[]) {
    const { hierarchy, minMax } = this.prepareData(options, data);

    this.render(hierarchy, minMax, options.color_range ?? [])
  }

  private prepareData(_: HierarchicalDataVizOptions, data: DataRecord[]) {
    const hierarchy = toHierarchy(data);
    const minMax = this.getMinmax(hierarchy);

    return { hierarchy, minMax };
  }

  private getMinmax(items: Hierarchical<any>[], nameField?: string, valueField?: string) {
    const minMax: [number, number] = [Infinity, -Infinity];

    for (const item of items) {
      nameField && (item['name'] = item[nameField]);
      valueField && (item['value'] = item[valueField]);

      item.value < minMax[0] && (minMax[0] = item.value);
      item.value > minMax[1] && (minMax[1] = item.value);

      if (item.children?.length > 0) {
        const childMinmax = this.getMinmax(item.children)

        childMinmax[0] < minMax[0] && (minMax[0] = childMinmax[0]);
        childMinmax[1] > minMax[1] && (minMax[1] = childMinmax[1]);
      }
    }

    return minMax;
  }

  render(data: Hierarchical<any>, minMax: [number, number], colorRange?: string[]) {
    const options: EChartsOption = {
      textStyle: { fontFamily: 'Almarai' },
      series: {
        type: 'sunburst',
        data,
        radius: [0, '95%'],
        sort: undefined,
        emphasis: {
          focus: 'ancestor'
        },
        levels: [
          {},
          {
            r0: '15%',
            r: '35%',
            itemStyle: {
              borderWidth: 2
            },
            label: {
              rotate: 'tangential',
            }
          },
          {
            r0: '35%',
            r: '70%',
            label: {
              align: 'right'
            }
          },
          {
            r0: '70%',
            r: '72%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false
            },
            itemStyle: {
              borderWidth: 3
            }
          }
        ]
      }
    }

    if (colorRange?.length)
      options.visualMap = {
        type: 'continuous',
        min: 0,
        max: 10,
        inRange: {
          color: colorRange
        }
      }

    this.chartOptions = options;
  }
}
