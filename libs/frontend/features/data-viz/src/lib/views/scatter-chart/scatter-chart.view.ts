/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Input, booleanAttribute } from '@angular/core';
import { EChartsOption, registerTransform, ScatterSeriesOption } from 'echarts';
import { BaseDataViz, DataVizScatterSerie, Field, ScatterDataVizOptions } from '@pestras/shared/data-model';
import * as estat from 'echarts-stat';
import { ChartDataLoad } from '../../util';
import { RegionsState } from '@pestras/frontend/state';

registerTransform((estat as any).transform.regression);
registerTransform((estat as any).transform.clustering);

const COLORS = [
  '#37A2DA',
  '#e06343',
  '#37a354',
  '#b55dba',
  '#b5bd48',
  '#8378EA',
  '#96BFFF'
];

@Component({
  selector: 'app-scatter-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class ScatterChartView implements OnInit {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  constructor(
    private regionsState: RegionsState
  ) { }

  ngOnInit() {
    const { dataset, series, visualMap } = this.init(this.conf.options);

    this.render(dataset, series, visualMap);
  }

  init(options: ScatterDataVizOptions) {
    const data = options.series.map((s, i) => this.prepareSerie(s, i));
    const dataset: any[] = data.map(d => ({ source: d.data }));
    let series: any[] = data.map(d => ({ type: 'scatter', datasetIndex: d.index }));
    const visualMap = data.map(d => d.size
      ? ({
        show: false,
        dimension: d.size.name,
        min: d.size.min,
        max: d.size.max,
        seriesIndex: d.index,
        inRange: { symbolSize: [10, 50] }
      })
      : null
    ).filter(Boolean) as any[];

    if (dataset.length === 1) {
      if (options.regression) {
        dataset.push({
          transform: {
            type: 'ecStat:regression',
            config: {
              method: options.regression.type,
              order: options.regression.order ?? 2
            }
          }
        });

        series.push({
          name: 'regression',
          type: 'line',
          smooth: true,
          datasetIndex: dataset.length - 1,
          symbolSize: 0.1,
          symbol: 'circle',
          label: { show: true, fontSize: 16 },
          labelLayout: { dx: -20 },
          encode: { label: 2, tooltip: 1 }
        });

      } else if (options.cluster) {
        const headers = dataset[0].source[0];

        dataset.push({
          transform: {
            type: 'ecStat:clustering',
            config: {
              clusterCount: options.cluster,
              outputType: 'single',
              outputClusterIndexDimension: headers.length
            }
          }
        });

        series = [{
          type: 'scatter',
          encode: { tooltip: headers as string[] },
          itemStyle: {
            borderColor: '#888'
          },
          datasetIndex: 1
        }];

        const pieces = [];
        for (let i = 0; i < options.cluster; i++) {
          pieces.push({
            value: i,
            label: 'G' + (i + 1),
            color: COLORS[i]
          });
        }

        visualMap.push({
          type: 'piecewise',
          top: 'middle',
          left: 10,
          splitNumber: options.cluster,
          dimension: headers.length,
          pieces
        })
      }
    }

    return { dataset, series, visualMap };
  }

  prepareSerie(serieOptions: DataVizScatterSerie, index: number) {
    const xField = this.data.fields.find(f => f.name === serieOptions.x);

    if (!xField)
      throw `x axis field '${serieOptions.x}' not found, for scaterr chart!`;

    const yField = this.data.fields.find(f => f.name === serieOptions.y);

    if (!yField)
      throw `y axis field '${serieOptions.y}' not found, for scaterr chart!`;

    let sizeField: Field | undefined;

    if (serieOptions.size)
      sizeField = this.data.fields.find(f => f.name === serieOptions.size?.field);

    const headers: string[] = [xField.display_name, yField.display_name];

    if (sizeField)
      headers.push(sizeField.display_name);

    return {
      index,
      name: serieOptions.serie_name || `${xField.display_name}_${yField.display_name}`,
      data: [headers, ...this.data.records.map(r => [r[xField.name], r[yField.name], sizeField ? r[sizeField.name] : 10])],
      size: sizeField ? { name: sizeField.display_name, min: serieOptions.size?.min, max: serieOptions.size?.max } : null
    }
  }


  render(dataset: any[], series: ScatterSeriesOption[], visualMap: any[]) {

    this.chartOptions = {
      textStyle: {
        fontFamily: 'Almarai'
      },
      dataset: dataset,
      legend: {
        bottom: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.dark ? '#224' : '#EEF',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: this.dark ? '#DDF' : '#335' },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: this.dark ? '#DDF' : '#335' },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      visualMap,
      series
    }
  }
}
