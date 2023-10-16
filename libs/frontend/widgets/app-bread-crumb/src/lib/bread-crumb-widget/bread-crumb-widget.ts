import { Component, Input, OnChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BlueprintsState, DataStoresState, RecordsService, TopicsState } from "@pestras/frontend/state";
import { untilDestroyed } from "@pestras/frontend/ui";
import { ContraService } from "@pestras/frontend/util/contra";
import { Blueprint, DataRecord, DataStore } from "@pestras/shared/data-model";
import { IBreadCrumb } from "libs/frontend/ui/src/lib/breadcrumb/breadcrumb.interface";
import { combineLatest, map, switchMap } from "rxjs";



@Component({
  selector: 'pestras-bread-crumb-widget',
  template: `<app-breadcrumb [breadcrumbs]="levels"></app-breadcrumb>`
})
export class BreadCrumbWidgetComponent implements OnChanges {
  private ud = untilDestroyed();

  levels: IBreadCrumb[] = [];

  @Input({ required: true })
  page!: string;

  constructor(
    private topicsState: TopicsState,
    private route: ActivatedRoute,
    private contra: ContraService,
    private dsState: DataStoresState,
    private bpState: BlueprintsState,
    private recordsService: RecordsService
  ) { }

  ngOnChanges(): void {
    const content = this.contra.content();

    // topic details page
    if (this.page === 'topic') {
      const serial = this.route.snapshot.paramMap.get('serial') ?? '';

      this.topicsState.select(serial)
        .pipe(this.ud())
        .subscribe(t => {
          this.levels = [
            { label: content['topics'], link: ['/main/topics'] },
            { label: t?.name || '', link: ['/main/topics', serial ?? ''] }
          ];
        });

      // record details page
    } else if (this.page === "records") {
      const topicSerial = this.route.snapshot.paramMap.get('topic');
      const dsSerial = this.route.snapshot.paramMap.get('dataStore');
      const recordSerial = this.route.snapshot.paramMap.get('record');

      // record details through topic page
      if (topicSerial) {
        combineLatest([
          this.topicsState.select(topicSerial),
          this.dsState.select(dsSerial ?? ''),
          this.recordsService.getBySerial({ ds: dsSerial ?? '', serial: recordSerial ?? '' })
        ])
          .pipe(this.ud())
          .subscribe(([topic, ds, record]) => {
            this.levels = [
              { label: content['topics'], link: ['/main/topics'] },
              { label: topic?.name || '', link: ['/main/topics', topicSerial ?? ''] },
              { label: record?.[ds?.settings.interface_field ?? ''], link: [''] }
            ];
          });

        // record details through blueprint and data stores
      } else {
        combineLatest([
          this.dsState.select(dsSerial ?? ''),
          this.recordsService.getBySerial({ ds: dsSerial ?? '', serial: recordSerial ?? '' })
        ])
          .pipe(
            switchMap(([ds, record]) => {
              return this.bpState.select(ds?.blueprint ?? '')
                .pipe(map(bp => [bp, ds, record] as [Blueprint, DataStore, DataRecord]))
            }),
            this.ud()
          )
          .subscribe(([bp, ds, record]) => {
            this.levels = [
              { label: content['blueprints'], link: ['/main/blueprints'] },
              { label: bp?.name ?? '', link: ['/main/blueprints', ds?.blueprint ?? ''] },
              { label: ds?.name ?? '', link: ['/main/data-stores', ds?.blueprint ?? '', ds?.serial ?? ''] },
              { label: record?.[ds?.settings.interface_field ?? ''], link: [''] }
            ];
          });

      }


    } else if (this.page === 'blueprint') {
      // blueprint details page

    } else if (this.page === 'dashboard') {
      // dashboard details page
      //
    } else if (this.page === 'report') {
      // report details page
      //
    } else if (this.page === 'dataStore') {
      // data store details page
      //
    }
  }
}