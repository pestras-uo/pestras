/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input } from '@angular/core';
import { BaseDataViz, PolarDataVizOptions } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

const colors = ['#55DD88', '#FFBB55', '#FF4455'];

@Component({
  selector: 'app-polar-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class PolarChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const { categories, values } = this.init(this.conf.options);

    this.render(this.conf.options, categories, values);
  }

  init(options: PolarDataVizOptions) {
    const valueField = this.data.fields.find(f => f.name === options.value_field);
    const catField = this.data.fields.find(f => f.name === options.category_field);

    if (!valueField)
      throw new Error(`value field not found (${options.value_field}): polar chart`);

    if (!catField)
      throw new Error(`category field not found (${options.category_field}): polar chart`);

    const categories: string[] = [];
    const values: number[] = [];

    for (const r of this.data.records) {
      categories.push(r[catField.name]);
      values.push(r[valueField.name]);
    }

    return { categories, values };
  }



  private getColor(value: number, reverse: boolean) {
    if (value <= 33)
      return reverse ? colors[2] : colors[0];

    if (value <= 66)
      return colors[1];

    return reverse ? colors[0] : colors[2];
  }



  getInnerRadius(count: number) {
    return Math.round(100 / count) + '%';
  }


  render(options: PolarDataVizOptions, categories: string[], values: number[]) {
    this.chartOptions = {
      angleAxis: {
        min: 0,
        max: 100,
        axisLabel: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      polar: {
        radius: [this.getInnerRadius(values.length), '80%']
      },
      radiusAxis: {
        type: 'category',
        data: categories,
        z: 10,
        axisLabel: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFF',
          padding: [0, -12, 0, 0]
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      series: [
        {
          type: 'bar',
          showBackground: true,
          data: options.indicator
            ? values.map(d => ({ value: d, itemStyle: { color: this.getColor(d, options.reverse_indicator) } }))
            : values,
          coordinateSystem: 'polar',
          roundCap: true,
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  }
}