/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input, booleanAttribute } from '@angular/core';
import { BaseDataViz, TimelineDataVizOptions, lerp } from '@pestras/shared/data-model';
import { BarSeriesOption, EChartsOption } from 'echarts';
import { ChartDataLoad } from '../../util';

@Component({
  selector: 'app-timeline-chart',
  template: '<div *ngIf="chartOptions" echarts [options]="chartOptions" class="chart"></div>',
  styles: [`
    :host { display: block; height: 100%; }
    .chart { height: 100%; }
  `]
})
export class TimelineChartView implements OnChanges {

  chartOptions!: EChartsOption;

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  ngOnChanges() {
    const { categories, startDates, endDates, indicators } = this.prepareDatasetsAndSeries(this.conf.options);

    this.render(categories, startDates, endDates, indicators);
  }

  private prepareDatasetsAndSeries(options: TimelineDataVizOptions) {
    const categories: string[] = [];
    const startDates: Date[] = [];
    const endDates: Date[] = [];
    const indicators: number[] = [];
    const categoryField = this.data.fields.find(f => f.name === options.category_field);
    const startDateField = this.data.fields.find(f => f.name === options.start_field);
    const endDateField = this.data.fields.find(f => f.name === options.end_field);
    const indicatorField = this.data.fields.find(f => f.name === options.indicator);
    const keyValue = new Map<string, { startDate: Date, endDate: Date, indicator: number | null }>();

    if (!categoryField)
      throw new Error(`category field not found (${options.category_field}): timeline chart`);

    if (!startDateField)
      throw new Error(`start date field not found (${options.start_field}): timeline chart`);

    if (!endDateField)
      throw new Error(`end date field not found (${options.end_field}): timeline chart`);

    for (const r of this.data.records)
      keyValue.set(r[categoryField.name], {
        startDate: r[startDateField.name],
        endDate: r[endDateField.name],
        indicator: indicatorField ? r[indicatorField.name] : null
      });

    for (const [key, value] of keyValue) {
      categories.push(key);
      startDates.push(new Date(value.startDate));
      endDates.push(new Date(value.endDate));
      indicatorField && (value.indicator !== null) && indicators.push(+value.indicator)
    }

    return { categories, startDates, endDates, indicators };
  }

  dateToString(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`
  }

  render(categories: string[], startDates: Date[], endDates: Date[], indicators: number[]) {
    let mappedIndicators: Date[] = [];

    if (indicators?.length)
      mappedIndicators = indicators.map((v, i) => {
        return new Date(lerp(v, [0, 100], [startDates[i].getTime(), endDates[i].getTime()]))
      });

    const series: BarSeriesOption[] = [{
      name: 'End Date',
      barGap: 0,
      type: 'bar',
      barWidth: 100,
      color: "#4488CC",
      stack: 'a',
      label: {
        color: this.dark ? '#DDF' : '#335',
        show: true,
        position: 'insideRight',
        formatter: (p: any) => {
          return this.dateToString(p.value as Date)
        }
      },
      data: endDates
    }, {
      name: 'Start Date',
      type: 'bar',
      stack: 'a',
      silent: true,
      itemStyle: {
        borderColor: '#FFFFFF',
        color: '#FFFFFF'
      },
      label: {
        color: '#FFFFFF',
        show: true,
        position: 'right',
        formatter: (p: any) => {
          return this.dateToString(p.value as Date)
        }
      },
      emphasis: {
        itemStyle: {
          borderColor: '#FFFFFF',
          color: '#FFFFFF'
        }
      },
      data: startDates
    }];

    if (indicators?.length) {
      series.push({
        name: 'Progress',
        type: 'bar',
        color: "#44CC88",
        stack: 'b',
        barWidth: 20,
        label: {
          color: this.dark ? '#DDF' : '#335',
          show: true,
          position: 'insideRight',
          formatter: function (p) {
            return indicators[p.dataIndex] + '%'
          }
        },
        data: mappedIndicators
      },
        {
          type: 'bar',
          stack: 'b',
          silent: true,
          itemStyle: {
            borderColor: '#FFFFFF',
            color: '#FFFFFF'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#FFFFFF',
              color: '#FFFFFF'
            }
          },
          data: startDates
        });
    }

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.dark ? '#224' : '#EEF',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (p: any) => {
          let output = `
            ${p[0].name}<br>
            <div style="width: 180px">
          `;

          for (let i = 0; i < 2; i++) {
            output += `
              ${p[i].marker} ${p[i].seriesName}:
              <strong style="float: right">${this.dateToString(p[i].data as Date)}</strong>
              <br>
            `
          }

          if (indicators?.length) {
            output += `
              ${p[2].marker} ${p[2].seriesName}:
              <strong style="float: right">${indicators[p[2].dataIndex]}%</strong>
              </div>
            `;

          } else {
            output += '</div>'
          }

          return output;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        axisLabel: { color: this.dark ? '#DDF' : '#335' },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        axisLabel: { color: this.dark ? '#DDF' : '#335' },
        data: categories,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series
    };
  }
}