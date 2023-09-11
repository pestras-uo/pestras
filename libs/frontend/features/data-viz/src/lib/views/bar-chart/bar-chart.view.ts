/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { BarDataVizOptions, BaseDataViz, Field } from '@pestras/shared/data-model';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-bar-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class BarChartView implements OnChanges {
  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const { categories, series, valueFields } = this.init(this.conf.options);

    this.render(this.conf.options, categories as string[], series, valueFields as Field[]);
  }

  private init(options: BarDataVizOptions) {
    const catField = this.data.fields.find(f => f.name === options.category_field);
    const valueFields = options.value_fields
      .map(vf => this.data.fields.find(f => f.name === vf))
      .filter(Boolean);

    if (!catField)
      throw new Error(`category field not found (${options.category_field}): bar chart`);

    if (!valueFields[0])
      throw new Error(`value field not found (${options.value_fields[0]}): bar chart`);

    const categories = this.data.records.map(r => r[catField.name]);
    const series: BarSeriesOption[] = valueFields.map((vf, i) => {
      const data = this.data.records
        .map(r => vf ? r[vf.name] : null)
        .filter(Boolean) as BarSeriesOption[];

      return {
        type: 'bar',
        name: vf?.display_name,
        data,
        yAxisIndex: i
      }
    });

    return { categories, series, valueFields }
  }

  /**
   * Render stack bar chart with multible series
   * @param dataset 
   * @param seriesCount 
   */
  render(options: BarDataVizOptions, categories: string[], series: BarSeriesOption[], valueFields: Field[]) {
    const labelOptions: BarSeriesOption['label'] = {
      show: true,
      formatter: function (param: any) {
        return "" + Math.round(+param.value);
      },
      fontSize: 16
    }

    if (options.horizontal) {
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
            ${param.marker} <span style='margin-inline-end: 28px'>${param.name}</span> <strong>${Math.round(+param.value)}</strong>
          `
        },
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: series.length > 1 ? { 
        // orient: 'vertical', 
        // left: 'right',
        // top: 'center'
      } : undefined,
      grid: {
        top: series.length > 1 ? '8%' : '3%',
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: options.horizontal
        ? { type: 'value', boundaryGap: [0, 0.01] }
        : { type: 'category', data: categories, axisLabel: { rotate: 45 } },
      yAxis:
        !options.horizontal
          ? valueFields.map(f => ({ 
            type: 'value', 
            boundaryGap: [0, 0.01],
            formatter: function (value: number) { return value + ' ' + f.unit} 
          }))
          : { type: 'category', data: categories },
      series: series.map(s => ({ ...s, label: labelOptions }))
    };
  }
}