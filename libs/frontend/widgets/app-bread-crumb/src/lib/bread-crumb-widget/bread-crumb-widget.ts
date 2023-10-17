import { Component, Input, OnChanges, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BlueprintsState,
  ClientApiService,
  DashboardsService,
  DashboardsState,
  DataStoresState,
  RecordsService,
  ReportsService,
  TopicsState,
} from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';
import { ContraService } from '@pestras/frontend/util/contra';
import { Blueprint, DataRecord, DataStore } from '@pestras/shared/data-model';
import { link } from 'fs';
import { BlueprintsService } from '@pestras/frontend/state';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { IBreadCrumb } from 'libs/frontend/ui/src/lib/breadcrumb/breadcrumb.interface';
import { combineLatest, last, map, switchMap } from 'rxjs';

@Component({
  selector: 'pestras-bread-crumb-widget',
  template: `<app-breadcrumb [breadcrumbs]="levels"></app-breadcrumb>`,
})
export class BreadCrumbWidgetComponent implements OnChanges {
  private ud = untilDestroyed();

  menuValue = '';
  levels: IBreadCrumb[] = [];

  @Input({ required: true })
  page!: string;
  lastValueUrl = '';
  constructor(
    private topicsState: TopicsState,
    private route: ActivatedRoute,
    private contra: ContraService,
    private dsState: DataStoresState,
    private bpState: BlueprintsState,
    private dshState: DashboardsState,
    private blState: BlueprintsState,
    private recordsService: RecordsService,
    private reportService: ReportsService,
    private dashboardService: DashboardsService,
    private blueprintService: BlueprintsService,
    private clientService: ClientApiService
  ) {}

  ngOnChanges(): void {
    const content = this.contra.content();

    // topic details page
    if (this.page === 'topic') {
      const serial = this.route.snapshot.paramMap.get('serial') ?? '';

      this.topicsState
        .select(serial)
        .pipe(this.ud())
        .subscribe((t) => {
          this.levels = [
            { label: content['topics'], link: ['/main/topics'] },
            { label: t?.name || '', link: ['/main/topics', serial ?? ''] },
          ];
        });

      // record details page
    } else if (this.page === 'records') {
      const topicSerial = this.route.snapshot.paramMap.get('topic');
      const dsSerial = this.route.snapshot.paramMap.get('dataStore');
      const recordSerial = this.route.snapshot.paramMap.get('record');

      // record details through topic page
      if (topicSerial) {
        combineLatest([
          this.topicsState.select(topicSerial),
          this.dsState.select(dsSerial ?? ''),
          this.recordsService.getBySerial({
            ds: dsSerial ?? '',
            serial: recordSerial ?? '',
          }),
        ])
          .pipe(this.ud())
          .subscribe(([topic, ds, record]) => {
            this.levels = [
              { label: content['topics'], link: ['/main/topics'] },
              {
                label: topic?.name || '',
                link: ['/main/topics', topicSerial ?? ''],
              },
              {
                label: record?.[ds?.settings.interface_field ?? ''],
                link: [''],
              },
            ];
          });

        // record details through blueprint and data stores
      } else {
        combineLatest([
          this.dsState.select(dsSerial ?? ''),
          this.recordsService.getBySerial({
            ds: dsSerial ?? '',
            serial: recordSerial ?? '',
          }),
        ])
          .pipe(
            switchMap(([ds, record]) => {
              return this.bpState
                .select(ds?.blueprint ?? '')
                .pipe(
                  map(
                    (bp) =>
                      [bp, ds, record] as [Blueprint, DataStore, DataRecord]
                  )
                );
            }),
            this.ud()
          )
          .subscribe(([bp, ds, record]) => {
            this.levels = [
              { label: content['blueprints'], link: ['/main/blueprints'] },
              {
                label: bp?.name ?? '',
                link: ['/main/blueprints', ds?.blueprint ?? ''],
              },
              {
                label: ds?.name ?? '',
                link: [
                  '/main/data-stores',
                  ds?.blueprint ?? '',
                  ds?.serial ?? '',
                ],
              },
              {
                label: record?.[ds?.settings.interface_field ?? ''],
                link: [''],
              },
            ];
          });
      }
    } else if (this.page === 'blueprint') {
      // blueprint details page
      const serial = this.route.snapshot.paramMap.get('serial') ?? '';

      this.blState
        .select(serial)
        .pipe(this.ud())
        .subscribe((t) => {
          this.levels = [
            {
              label: content['blueprints'],
              link: ['/main/blueprints'],
            },
            {
              label: t?.name || '',
              link: ['/main/blueprints', serial ?? ''],
            },
          ];
        });
      //
    } else if (this.page === 'dashboard') {
      // dashboard details page
      const topicSerial = this.route.snapshot.paramMap.get('topic');
      const dshSerial = this.route.snapshot.paramMap.get('serial');

      if (dshSerial && !topicSerial) {
        combineLatest([
          this.dshState.select(dshSerial ?? ''),
          this.dashboardService.getBySerial({
            serial: dshSerial ?? '',
          }),
        ])
          .pipe(this.ud())
          .subscribe(([dsh, dashboard]) => {
            this.levels = [
              { label: content['dashboards'], link: ['/main/dashboards'] },

              {
                label: dashboard?.title || '',
                link: ['/main/dashboards', dshSerial ?? ''],
              },
            ];
          });
      } else {
        const serial = this.route.snapshot.paramMap.get('topic') ?? '';

        combineLatest([
          this.dshState.select(serial ?? ''),
          this.topicsState.select(serial ?? ''),

          this.dashboardService.getBySerial({
            serial: dshSerial ?? '',
          }),
        ])
          .pipe(this.ud())
          .subscribe(([dsh, tp,dashboard]) => {
            this.levels = [
              { label: content['topics'], link: ['/main/topics'] },

              {
                label: tp?.name || '',
                link: ['/main/topics', tp?.serial ?? ''],
                queryParams: { menu: 'dashboards' },
              },
              {
                label: dashboard?.title || '',
                link: ['/main/dashboards', tp?.serial ?? ''],
              },
            ];
          });
      }

    } else if (this.page === 'report') {
      const topicSerial = this.route.snapshot.paramMap.get('topic');
      const reportSerial = this.route.snapshot.paramMap.get('serial');

      // record details through topic page
      if (topicSerial) {
        combineLatest([
          this.topicsState.select(topicSerial),
          this.dsState.select(reportSerial ?? ''),
          this.reportService.getBySerial({
            serial: reportSerial ?? '',
          }),
        ])
          .pipe(this.ud())
          .subscribe(([topic, ds, rep]) => {
            this.levels = [
              { label: content['topics'], link: ['/main/topics'] },
              {
                label: topic?.name || '',
                link: ['/main/topics', topicSerial ?? ''],
                queryParams: { menu: 'reports' },
              },
              {
                label: rep?.title || '',
                link: ['/main/topics', topicSerial ?? ''],
              },
            ];
          });

        // record details through blueprint and data stores
      } else {
        combineLatest([
          this.dsState.select(this.lastValueUrl ?? ''),
          this.reportService.getBySerial({
            serial: reportSerial ?? '',
          }),
        ])
          .pipe(
            switchMap(([ds, record]) => {
              return this.bpState
                .select(ds?.blueprint ?? '')
                .pipe(
                  map(
                    (bp) =>
                      [bp, ds, record] as [Blueprint, DataStore, DataRecord]
                  )
                );
            }),
            this.ud()
          )
          .subscribe(([bp, ds, record]) => {
            this.levels = [
              { label: content['blueprints'], link: ['/main/blueprints'] },
              {
                label: bp?.name ?? '',
                link: ['/main/blueprints', ds?.blueprint ?? ''],
              },
              {
                label: ds?.name ?? '',
                link: [
                  '/main/data-stores',
                  ds?.blueprint ?? '',
                  ds?.serial ?? '',
                ],
              },
              {
                label: record?.[ds?.settings.interface_field ?? ''],
                link: [''],
              },
            ];
          });
      }
    } else if (this.page === 'dataStore') {
      const dsSerial = this.route.snapshot.paramMap.get('serial') ?? '';
      const blSerial = this.route.snapshot.paramMap.get('blueprint');

      combineLatest([
        this.blState.select(blSerial ?? ''),
        this.dsState.select(dsSerial ?? ''),
        this.blueprintService.getBySerial({
          serial: dsSerial ?? '',
        }),
      ])
        .pipe(this.ud())
        .subscribe(([bl, ds]) => {
          this.levels = [
            { label: content['blueprints'], link: ['/main/blueprints'] },
            {
              label: bl?.name || '',
              link: ['/main/blueprints', blSerial ?? ''],
            },
            {
              label: ds?.name,
              link: [''],
            },
          ];
        });
    } else if (this.page === 'clients-api') {
      const dsSerial = this.route.snapshot.paramMap.get('serial') ?? '';
      const blSerial = this.route.snapshot.paramMap.get('blueprint');

      combineLatest([
        this.blState.select(blSerial ?? ''),
        this.dsState.select(dsSerial ?? ''),
        this.clientService.getBySerial({
          serial: dsSerial ?? '',
        }),
      ])
        .pipe(this.ud())
        .subscribe(([bl, ds, client]) => {
          this.levels = [
            { label: content['blueprints'], link: ['/main/blueprints'] },
            {
              label: bl?.name || '',
              link: ['/main/blueprints', blSerial ?? ''],
            },
            {
              label: client?.client_name,
              link: [''],
            },
          ];
        });
    }
  }
}
