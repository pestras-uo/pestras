/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { LineDataVizOptions, BaseDataViz } from '@pestras/shared/data-model';
import { EChartsOption, LineSeriesOption, graphic } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-line-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class LineChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const { xAxis, series } = this.init(this.conf.options);

    this.render(xAxis, series);
  }

  init(options: LineDataVizOptions) {
    const xField = this.data.fields.find(f => f.name === options.x);

    if (!xField)
      throw new Error(`x axis field not found (${options.x}): line chart`);

    const series: LineSeriesOption[] = options.series.map(s => {
      const field = this.data.fields.find(f => f.name === s.y);

      if (!field)
        return null;

      return {
        type: 'line',
        smooth: true,
        color: 'rgb(68, 210, 158)',
        symbol: options.area ? 'none' : '',
        name: s.serie_name || field.display_name,
        data: this.data.records.map(r => r[field.name]),
        markLine: s.mark_lines?.length ? { data: s.mark_lines.map(l => ({ type: l })) } : null,
        markPoint: s.mark_lines?.length ? { data: s.mark_lines.map(p => ({ type: p, name: p })) } : null,
        areaStyle: options.area 
          ? {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(68, 210, 158)'
              },
              {
                offset: 1,
                color: 'rgb(70, 210, 131)'
              }
            ])
          } : null
      } as LineSeriesOption
    })
      .filter(Boolean) as LineSeriesOption[];

    const xAxis: any = { boundaryGap: false };

    if (xField.type === 'date' || xField.type === 'datetime') {
      xAxis.type = 'time';
      xAxis.data = this.data.records.map(r => new Date(r[xField.name] as string));
    } else {
      xAxis.type = 'category';
      xAxis.data = this.data.records.map(r => r[xField.name]);
    }

    return { xAxis, series };
  }

  render(xAxis: any, series: LineSeriesOption[]) {
    this.chartOptions = {
      textStyle: { fontFamily: 'Almarai' },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '8%'
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: xAxis,
      yAxis: {
        type: 'value',
      },
      series
    };
  }
}
