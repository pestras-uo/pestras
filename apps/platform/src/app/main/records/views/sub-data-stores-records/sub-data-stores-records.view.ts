/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { DataStoresState, RegionsState } from '@pestras/frontend/state';
import { ToggleThemeService } from '@pestras/frontend/ui';
import { DataRecord, DataStore, DataStoreType, Field, SubDataStore, SubDataStoreChart, TableDataRecord, aggrRecords, createField } from '@pestras/shared/data-model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-sub-data-stores-records',
  templateUrl: './sub-data-stores-records.view.html',
  styleUrls: ['./sub-data-stores-records.view.scss']
})
export class SubDataStoresRecordsView implements OnChanges {
  readonly dsTypes = DataStoreType;

  search!: any;
  relation!: SubDataStore;

  subDataStore$!: Observable<DataStore | null>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  options!: string;
  @Input({ required: true })
  record!: DataRecord;

  theme$ = this.toggleThemeService.isDarkMode$.pipe(
    map((isdark) => (isdark ? 'dark' : 'light'))
  );

  constructor(
    private dsState: DataStoresState,
    private regionsState: RegionsState,
    protected toggleThemeService: ToggleThemeService
  ) { }

  ngOnChanges() {
    this.relation = this.dataStore.relations[+this.options]
    this.search = { [this.relation.on.foreign_field]: this.record[this.relation.on.local_field] };

    this.subDataStore$ = this.dsState.select(this.relation.data_store);
  }

  getCharts = (rel: SubDataStore): SubDataStoreChart[] => {
    return rel.charts_order
      .map(s => rel.charts.find(c => c.serial === s) ?? null)
      .filter(Boolean) as SubDataStoreChart[];
  }

  aggregate(chart: SubDataStoreChart, originalFields: Field[], list: TableDataRecord[]) {
    const { data: records, fields } = aggrRecords(originalFields, list, chart.options.aggregate);
    const regionFields = fields.filter((f) => f.type === 'region');

    if (regionFields.length)
      for (const r of records)
        for (const field of regionFields)
          r[field.name] = this.regionsState.get(
            r[field.name] as string
          )?.name;

    return {
      fields: fields.map((t) => createField(t)),
      records
    }
  }
}
