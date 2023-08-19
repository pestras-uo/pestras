/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-user-activity',
  template: `
    <div echarts [options]="chartOption$ | async" class="chart"></div>
  `,
  styles: [`
    :host { height: 100%; }
    .chart { height: 100%; }
  `]
})
export class UserActivityChart implements OnChanges {
  chartOption$!: Observable<EChartsOption>;

  @Input({ required: true })
  serial!: string;

  ngOnChanges(): void {
    this.chartOption$ = of({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        right: '4%',
        bottom: '8%',
        left: '6%'
      },
      series: [
        {
          data: [6, 3, 10, 8, 12, 5, 2],
          type: 'line',
          smooth: true
        }
      ]
    } as EChartsOption)
  }
}
