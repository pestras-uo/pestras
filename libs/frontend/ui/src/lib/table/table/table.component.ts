/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { OnInit, Component, Input, TemplateRef, OnDestroy, Output, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Subject, combineLatest, startWith, throttleTime, distinctUntilChanged } from 'rxjs';
import { PuiTableActionOutput, PuiTableColumn, PuiTableColumnType, PuiTableConfig, PuiTableQuery } from '../types';
import { objUtil, sorter, strUtil } from '@pestras/shared/util';

@Component({
  selector: 'pui-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiTable implements OnInit, OnDestroy, OnChanges {
  private querySub: Subscription | null = null;
  private lastQuery: PuiTableQuery = { page: 0, search: '', sort: {} };

  readonly sortState$ = new BehaviorSubject<Record<string, 1 | -1>>({});
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly pageControl = new FormControl(1, { nonNullable: true });

  pagesCount = 1;
  changes = 0;
  count = 0

  query: PuiTableQuery | null = {};
  filtered: any[] = [];

  @Input({ required: true })
  config!: PuiTableConfig;
  @Input({ required: true })
  list: any[] | null = [];
  // @Input()
  // footer: any[] | null = [];
  @Input()
  templates: Record<string, TemplateRef<any>> = {};
  @Input()
  subTemplate?: TemplateRef<any>;
  @Input()
  searchPlaceholder = 'Search'

  @Output()
  actionClick = new Subject<PuiTableActionOutput>();
  @Output()
  rowClick = new Subject<any>();

  constructor(private readonly router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'])
      this.prepareConfig();

    this.count = this.list?.length || 0;
    this.pagesCount = (this.config.pagination || 0) > 0 
      ? Math.ceil(this.count / (this.config.pagination || this.count))
      : 1
    this.filtered = this.filter();
  }

  ngOnInit(): void {
    this.prepareConfig();

    // listen for query change
    this.querySub = combineLatest([
      this.pageControl.valueChanges.pipe(startWith(1)),
      this.sortState$,
      this.searchControl.valueChanges.pipe(
        startWith(""),
        distinctUntilChanged(),
        throttleTime(500, undefined, { leading: true, trailing: true }),
      )
    ]).subscribe(([page, sort, search]) => {

      this.query = {
        sort: this.config.sort ? this.config.sort.length ? sort : undefined : undefined,
        search: this.config.search ? search : undefined,
        // if search or sort changed reset page to 1
        page: !this.config.pagination
          ? undefined
          : search !== this.lastQuery.search || !objUtil.equals(this.lastQuery.sort, sort)
            ? 1
            : page,
      };

      this.filtered = this.filter();
    });
  }

  filter() {
    if (!this.query)
      return this.list || [];

    if (!this.list)
      return [];

    let output: any[] = [];

    if (this.query.search)
      output = this.list.filter(el => {
        for (const col of this.config.columns.filter(c => c.type === PuiTableColumnType.TEXT || c.searchable))
          if (("" + el[col.key]).includes(this.query?.search ?? ''))
            return true;

        return false;
      });
    else
      output = [...this.list];

    if (output.length && this.query.sort)
      output.sort(sorter(this.query.sort));

    if (output.length && this.query.page) {
      const start = (this.config.pagination || 10) * (this.query.page - 1);
      const end = start + (this.config.pagination || 10);

      output = output.slice(start, end);
    }

    return output;
  }

  ngOnDestroy(): void {
    !!this.querySub && this.querySub.unsubscribe();
  }

  get pagesSeq() {
    return Array.from({ length: this.pagesCount }, (_, n) => n + 1);
  }

  private prepareConfig() {
    this.config.sort = this.config.sort || [];

    for (const column of this.config.columns) {
      column.header = column.header || column.key;
      column.type = column.type ?? PuiTableColumnType.TEXT;
      column.skip = column.skip ?? false;
      column.cssClass = column.cssClass || "";
    }
  }

  updateSort(column: PuiTableColumn) {
    if (!this.config.sort?.includes(column.key))
      return;


    let options = this.sortState$.getValue();

    if (!options) {
      options = { [column.key]: -1 };

    } else {
      const field = options[column.key];

      if (!field)
        options[column.key] = 1;
      else if (options[column.key] === 1) {
        options[column.key] = -1;
      } else {
        delete options[column.key];
      }
    }

    this.sortState$.next(options);
  }

  rowClicked(e: Event, item: any, tableRow: HTMLElement) {
    tableRow.classList.toggle('selected');

    if (this.config.rowLink) {
      e.stopPropagation();

      const link = strUtil.compile(this.config.rowLink, item);
      this.router.navigate(link.split('/'));

    } else
      this.rowClick.next(item);
  }

  actionClicked(e: Event, key: string, data: any) {
    e.stopPropagation();

    this.actionClick.next({ key, row: data });
  }

  // pagination
  nextPage() {
    const curr = this.pageControl.value;

    if (curr < this.pagesCount)
      this.pageControl.setValue(curr + 1);
  }

  prevPage() {
    const curr = this.pageControl.value;

    if (curr > 1)
      this.pageControl.setValue(curr - 1);
  }
}