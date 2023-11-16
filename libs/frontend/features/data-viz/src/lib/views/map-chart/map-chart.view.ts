/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  booleanAttribute,
} from '@angular/core';
import {
  BaseDataViz,
  DataRecord,
  Field,
  MapDataVizOptions,
  Region,
} from '@pestras/shared/data-model';
import { RegionsState } from '@pestras/frontend/state';
import { Serial } from '@pestras/shared/util';
import { map, take, of, Observable, filter } from 'rxjs';
import { ChartDataLoad } from '../../util';
import 'echarts-extension-gmap';
import { GoogleMapService } from '@pestras/frontend/ui';

export interface MapChartDataLoad {
  fields: Field[];
  records: DataRecord[];
  regions: Region[];
}

@Component({
  selector: 'app-map-chart',
  template: `
    <ng-container *ngIf="gMapService.mapApiLoaded$ | async">
      <ng-container *ngIf="payload$ | async as p">
        <app-map-regions-chart
          *ngIf="conf.options.regions"
          [options]="conf.options.regions"
          [payload]="p"
          [dark]="dark"
        ></app-map-regions-chart>
        <app-map-pie-chart
          *ngIf="conf.options.pie"
          [options]="conf.options.pie"
          [payload]="p"
          [dark]="dark"
        ></app-map-pie-chart>
        <app-map-scatter-chart
          *ngIf="conf.options.scatter"
          [options]="conf.options.scatter"
          [payload]="p"
          [dark]="dark"
        ></app-map-scatter-chart>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapChartView implements OnChanges {
  payload$!: Observable<MapChartDataLoad>;

  @Input({ required: true })
  conf!: Pick<BaseDataViz<any>, 'aggregate' | 'options' | 'type'>;
  @Input({ required: true })
  data!: ChartDataLoad;
  @Input({ transform: booleanAttribute })
  dark = false;

  constructor(
    private regionsState: RegionsState,
    public readonly gMapService: GoogleMapService
  ) {}

  ngOnChanges() {
    this.payload$ = this.getRegions(
      this.conf.options,
      this.data.fields,
      this.data.records
    ).pipe(
      filter((regions) => regions.length > 0),
      map((regions) => ({
        fields: this.data.fields,
        records: this.data.records,
        regions,
      })),
      take(1)
    );
  }

  private getRegions(
    options: MapDataVizOptions,
    fields: Field[],
    data: DataRecord[]
  ) {
    const serials = new Set<string>();

    if (options.use_map?.region) {
      return options.use_map.only_children
        ? this.regionsState.selectMany((r) =>
            Serial.isChild(options.use_map?.region ?? '', r.serial, 1)
          )
        : this.regionsState.selectMany([options.use_map.region]);
    }

    const regionField = options.regions
      ? fields.find((f) => f.name === options.regions?.region_field)
      : options.pie
      ? fields.find((f) => f.name === options.pie?.region_field)
      : null;

    if (!regionField) return of([]);

    for (const r of data) serials.add((r[regionField.name] as string) ?? '');

    return this.regionsState.selectMany([...serials].filter(Boolean)).pipe(
      filter((rg) => rg.length > 0),
      take(1)
    );
  }
}
