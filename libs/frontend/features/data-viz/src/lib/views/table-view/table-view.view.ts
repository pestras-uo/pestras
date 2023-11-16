/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnChanges, Input } from '@angular/core';
import { BaseDataViz, DataRecord, Field, TableDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { ChartDataLoad } from '../../util';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.view.html',
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class TableViewView implements OnChanges {

  readonly page$ = new BehaviorSubject<number>(1);

  list: DataRecord[] = [];
  skip = 0;
  count = 0;
  pageSize!: number;
  fields!: Field[];

  @Input({ required: true })
  conf!: Pick<BaseDataViz<any>, 'aggregate' | 'options' | 'type'>;
  @Input({ required: true })
  data!: ChartDataLoad;

  ngOnChanges() {
    const options: TableDataVizOptions = this.conf.options;
    this.list = this.data.records;
    this.count = this.list.length;
    this.pageSize = options.pagination ?? 20;
    this.fields = this.data.fields.filter(f => {
      return !['unknown', 'image', 'file'].includes(f.type) && f.kind !== TypeKind.RICH_TEXT;
    });
  }

  sliceList = (data: any[], page: number) => {
    this.count = data.length;
    this.skip = (page - 1) * this.pageSize;
    return data.slice(this.skip, this.skip + this.pageSize);
  }
}
