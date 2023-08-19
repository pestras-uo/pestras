/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { Orgunit } from '@pestras/shared/data-model';
import { EChartsOption } from 'echarts';
import { OrgunitsState } from '@pestras/frontend/state';
import { findHierarchyOf, toHierarchy, Serial } from '@pestras/shared/util';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-hierarchy',
  template: `
    <div echarts [options]="chartOption$ | async" class="chart"></div>
  `,
  styles: [`
    :host { height: 100%; }
    .chart { height: 100%; }
  `]
})
export class HierarchyChart implements OnChanges {

  chartOption$!: Observable<EChartsOption>;

  @Input({ required: true })
  root!: string;

  constructor(private readonly state: OrgunitsState) { }

  ngOnChanges(): void {

    this.chartOption$ = this.state.data$
      .pipe(
        map(list => ({ list, levels: this.countLevels(list) })),
        map(({ list, levels }) => ({ hie: toHierarchy(list), levels })),
        map(({ hie, levels }) => ({ data: findHierarchyOf(hie, this.root), levels })),
        map(({ data, levels }) => {

          const margins: any[] = [];

          for (let i = 0; i < levels; i++) {
            const r = (100 / (levels * 2)) * (i + 1);
            const margin: any = {
              r0: r + '%',
              r: (r * 2) + '%'
            };

            if (i === 0) {
              margin.itemStyle = { borderWidth: 2 };
              margin.label = { rotate: 'tangential' };
            } else if (i === levels - 1) {
              margin.itemStyle = { borderWidth: 3 };
              margin.labels = {
                position: 'outside',
                padding: 3,
                silent: false
              }
            } else {
              margin.label = { align: 'right' };
            }

            margins.push(margin)
          }

          return <EChartsOption>{
            textStyle: { fontFamily: 'Almarai' },
            series: {
              type: 'sunburst',
              data: data,
              radius: [0, '95%'],
              sort: undefined,
              emphasis: {
                focus: 'ancestor'
              },
              levels: [
                {},
                ...margins
              ]
            }
          }
        }));
  }

  countLevels(list: Orgunit[]) {
    const rootLevel = Serial.countLevels(this.root);
    return list
      .filter(org => Serial.isBranch(org.serial, this.root))
      .reduce((max, curr) => Math.max(max, (Serial.countLevels(curr.serial) - rootLevel)), 0);
  }
}
