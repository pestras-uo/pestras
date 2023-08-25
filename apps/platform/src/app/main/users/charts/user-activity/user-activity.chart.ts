/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EChartsOption } from 'echarts';
import { ActivitiesState } from '@pestras/frontend/state';

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
  chartOption$!: Observable<EChartsOption | null>;

  @Input({ required: true })
  serial!: string;
  @Input({ required: true })
  period!: string;

  constructor(private state: ActivitiesState) { }

  ngOnChanges(): void {

    this.chartOption$ = this.state.select(`${this.serial}-${this.period}`)
      .pipe(
        map(stats => {

          if (!stats)
            return null;

          return {
            xAxis: {
              type: 'category',
              data: stats.activities.map(act => act[0])
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
                data: stats.activities.map(act => act[1]),
                type: 'line',
                smooth: true
              }
            ]
          } as EChartsOption
        })
      )
  }
}
