/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input } from '@angular/core';
import { BaseDataViz, BoxplotDataVizOptions, Stats } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

interface BoxBlotStat { min: number; q1: number, median: number; q3: number; max: number; iqr: number; }

@Component({
  selector: 'app-boxplot-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class BoxplotChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const { seriesNames, source, stats } = this.init(this.conf.options);

    this.render(seriesNames as string[], source, stats);
  }

  init(options: BoxplotDataVizOptions) {
    const valueFields = options.value_fields
      .map(vf => this.data.fields.find(f => f.name === vf))
      .filter(Boolean);

    const stats: BoxBlotStat[] = valueFields.map(f => {
      const values = this.data.records
        .map(r => f ? r[f.name] : null)
        .filter(Boolean) as number[];

      return {
        min: Stats.min(values),
        q1: Stats.q1(values),
        median: Stats.median(values),
        q3: Stats.q3(values),
        max: Stats.max(values),
        iqr: Stats.iqr(values)
      }
    });

    const seriesNames = valueFields.map(f => f?.display_name);
    const source: number[][] = valueFields.map(_ => []);

    this.data.records.forEach((r, i) => {
      valueFields.forEach((f, j) => {
        if (f)
        source[j][i] =  r[f.name] as number;
      });
    });

    return { seriesNames, source, stats };
  }


  render(seriesNames: string[], source: number[][], stats: BoxBlotStat[]) {
    this.chartOptions = {
      dataset: [
        { source },
        {
          transform: {
            type: 'boxplot',
            config: {
              itemNameFormatter: function (params: { value: number }) {
                return seriesNames[params.value];
              }
            }
          }
        },
        {
          fromDatasetIndex: 1,
          fromTransformResult: 1
        }
      ],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (param: any) {
          const s = stats[param.dataIndex];
          return s 
            ? `
            <h4>${param.name}</h4>
            ${param.marker} Min <strong>${s?.min}</strong><br>
            ${param.marker} Qr1 <strong>${s?.q1}</strong><br>
            ${param.marker} Med <strong>${s?.median}</strong><br>
            ${param.marker} Qr3 <strong>${s?.q3}</strong><br>
            ${param.marker} Max <strong>${s?.max}</strong><br>
            ${param.marker} IQR <strong>${s?.iqr}</strong>
          `
          : `${param.name} <strong>${param.value[1]}</strong>`;
        }
      },
      grid: {
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitArea: {
          show: true
        }
      },
      series: [
        {
          name: 'boxplot',
          type: 'boxplot',
          datasetIndex: 1
        },
        {
          name: 'outlier',
          type: 'scatter',
          datasetIndex: 2
        }
      ]
    }
  }
}
