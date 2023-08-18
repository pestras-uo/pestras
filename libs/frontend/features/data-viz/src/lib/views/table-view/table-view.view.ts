/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input } from '@angular/core';
import { BaseDataViz, DataRecord, TableDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { PuiTableColumnType, PuiTableConfig } from '@pestras/frontend/ui';
import { ChartDataLoad } from '../../util';
import { CategoriesState, UsersState, OrgunitsState } from '@pestras/frontend/state';

@Component({
  selector: 'app-table-view',
  template: `
    <ng-container *contra="let c">
      <pui-table *ngIf="tableConfig" [config]="tableConfig" [searchPlaceholder]="c['search']" [list]="list"></pui-table>
    </ng-container>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class TableViewView implements OnChanges {

  tableConfig!: PuiTableConfig;
  list: DataRecord[] = [];

  @Input({ required: true })
  conf!: BaseDataViz<any>;
  @Input({ required: true })
  data!: ChartDataLoad;

  constructor(
    private catsState: CategoriesState,
    private usersState: UsersState,
    private orgsState: OrgunitsState
  ) { }

  ngOnChanges() {
    const options: TableDataVizOptions = this.conf.options;
    this.list = this.data.records;

    this.tableConfig = {
      indexing: true,
      pagination: options.pagination ?? 20,
      search: true,
      sort: [],
      columns: []
    };

    // string fields
    // ------------------------------------------------------------------------------------------------------------
    const stringFields = this.data.fields
      .filter(f => (f.type === 'string' && f.kind === TypeKind.NONE) || ['category', 'region'].includes(f.type));

    for (const f of stringFields) {
      this.tableConfig.sort?.push(f.name);
      this.tableConfig.columns.push({ key: f.name, header: f.display_name, searchable: true });
    }

    // categories fields
    // ------------------------------------------------------------------------------------------------------------
    const catsFields = this.data.fields.filter(f => f.type === 'category' && f.kind === TypeKind.ORDINAL);

    for (const f of catsFields) {
      this.tableConfig.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
        formatter: (key, _, row) => this.catsState.get(row[key])?.title ?? null
      });
    }

    // users fields
    // ------------------------------------------------------------------------------------------------------------
    const usersFields = this.data.fields.filter(f => f.type === 'serial' && f.ref_type === 'user');

    for (const f of usersFields) {
      this.tableConfig.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
        formatter: (key, _, row) => this.usersState.get(row[key])?.username ?? null
      });
    }

    // orgs fields
    // ------------------------------------------------------------------------------------------------------------
    const orgsFields = this.data.fields.filter(f => f.type === 'serial' && f.ref_type === 'orgunit');

    for (const f of orgsFields) {
      this.tableConfig.columns.push({
        key: f.name,
        header: f.display_name,
        searchable: true,
        formatter: (key, _, row) => this.orgsState.get(row[key])?.name ?? null
      });
    }    

    // numeric fields
    // ------------------------------------------------------------------------------------------------------------
    const numericFields = this.data.fields.filter(f => ['int', 'double'].includes(f.type));

    for (const f of numericFields) {
      this.tableConfig.sort?.push(f.name);
      this.tableConfig.columns.push({ key: f.name, header: f.display_name, type: PuiTableColumnType.NUMBER });
    }

    // date fields
    // ------------------------------------------------------------------------------------------------------------
    const dateFields = this.data.fields.filter(f => ['date', 'datetime'].includes(f.type));

    for (const f of dateFields) {
      this.tableConfig.sort?.push(f.name);
      this.tableConfig.columns.push({ key: f.name, header: f.display_name, type: PuiTableColumnType.DATE });
    }

    // boolean fields
    // ------------------------------------------------------------------------------------------------------------
    const boolFields = this.data.fields.filter(f => f.type === 'boolean');

    for (const f of boolFields)
      this.tableConfig.columns.push({ key: f.name, header: f.display_name, type: PuiTableColumnType.BOOL });

    // location fields
    // ------------------------------------------------------------------------------------------------------------
    const locFields = this.data.fields.filter(f => f.type === 'location');

    for (const f of locFields)
      this.tableConfig.columns.push({ key: f.name, header: f.display_name, type: PuiTableColumnType.LOCATION });

    // indicator
    // ------------------------------------------------------------------------------------------------------------
    if (options.indicator)
      this.tableConfig.indicator = {
        key: options.indicator.field,
        levels: [options.indicator.levels.orange, options.indicator.levels.red, options.indicator.levels.blink ?? undefined],
        header: 'Ind'
      }
  }
}
