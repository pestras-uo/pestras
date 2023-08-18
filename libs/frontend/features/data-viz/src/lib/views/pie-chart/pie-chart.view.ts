/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { BaseDataViz, PieDataVizOptions } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-pie-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class PieChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    this.renderPieChart(this.conf.options, this.init(this.conf.options));
  }

  init(options: PieDataVizOptions) {
    const valueField = this.data.fields.find(f => f.name === options.value_field);
    const catField = this.data.fields.find(f => f.name === options.category_field);

    if (!valueField)
      throw new Error(`value field not found (${options.value_field}): pie chart`);

    if (!catField)
      throw new Error(`category field not found (${options.category_field}): pie chart`);

    return this.data.records.map(r => ({ name: r[catField.name], value: r[valueField.name] }));
  }


  /**
   * Render Pie chart with single serie
   * @param dataset 
   */
  renderPieChart(options: PieDataVizOptions, data: { name: string, value: number }[]) {
    this.chartOptions = {
      textStyle: { fontFamily: 'Almarai' },
      tooltip: {
        trigger: 'item',
        formatter: '<h5>{b}</h5><p class="f7">{c} - %{d}</p>'
      },
      grid: {
        top: 0,
        bottom: 0,
      },
      series: [
        {
          type: 'pie',
          radius: [options.doughnut ? '30%' : '0%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            show: true,
            formatter(param) {
              // correct the percentage
              return param.name + ': ' + param.value + ' (' + (param?.percent || 0) * 2 + '%)';
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data
        }
      ]
    }
  }
}
