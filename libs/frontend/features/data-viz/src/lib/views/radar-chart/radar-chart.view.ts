/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input, booleanAttribute } from '@angular/core';
import { BaseDataViz, Field, RadarDataVizOptions } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-radar-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class RadarChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: Pick<BaseDataViz<any>, 'aggregate' | 'options' | 'type'>;
  @Input({ required: true })
  data!: ChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  ngOnChanges() {
    const { indicators, data } = this.init(this.conf.options);

    this.render(indicators, data);
  }

  init(options: RadarDataVizOptions) {
    const catField = this.data.fields.find(f => f.name === options.category_field);
    const valueFields = options.value_fields
      .map(vf => this.data.fields.find(f => f.name === vf))
      .filter(Boolean) as Field[];

    if (!catField)
      throw new Error(`category field not found (${options.category_field}): pie chart`);

    const indicators: { name: string; max: number; }[] = [];
    const series = new Map<string, number[]>();

    for (const r of this.data.records) {
      for (const field of valueFields) {
        const serie = series.get(field.display_name) || [];
        const cat = r[catField.name];

        let catIndex = indicators.findIndex(i => i.name === cat);

        if (catIndex === -1) {
          indicators.push({ name: cat, max: r[field.name] });
          catIndex = indicators.length - 1;
        } else
          indicators[catIndex].max = Math.max(indicators[catIndex].max, r[field.name]);

        serie[catIndex] = r[field.name];
        series.set(field.display_name, serie);
      }

    }

    return { indicators, data: [...series.entries()].map(([name, value]) => ({ name, value })) };
  }

  render(indicators: { name: string; max: number; }[], data: { name: string; value: number[] }[]) {
    
    this.chartOptions = {
      textStyle: { fontFamily: 'Almarai' },
      legend: {},
      radar: {
        // shape: 'circle',
        indicator: indicators,
        axisLabel: { color: this.dark ? '#DDF' : '#335' }
      },
      tooltip: {
        trigger: "item",
        backgroundColor: this.dark ? '#224' : '#FFF'
      },
      series: [
        {
          type: 'radar',
          data,
          label: { color: this.dark ? '#DDF' : '#335' }
        }
      ]
    };
  }
}