/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { OnInit, Component, Input, TemplateRef, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Subject, combineLatest, startWith, throttleTime, distinctUntilChanged } from 'rxjs';
import { PuiTableActionOutput, PuiTableColumn, PuiTableColumnType, PuiTableConfig, PuiTableQuery } from '../types';
import { objUtil, strUtil } from '@pestras/shared/util';

@Component({
  selector: 'pui-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styleUrls: ['./table-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiTableDynamic implements OnInit, OnDestroy {
  private querySub: Subscription | null = null;
  private lastQuery: PuiTableQuery | null = null;

  readonly sortState$ = new BehaviorSubject<Record<string, 1 | -1>>({});
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly pageControl = new FormControl(1, { nonNullable: true });

  pagesCount = 1;
  changes = 0;

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
  @Input()
  set count(value: number | null) {
    setTimeout(() => {
      value = value || 0;

      if (this.config.pagination && this.config.pagination > 0) {
        this.pagesCount = Math.ceil(value / this.config.pagination) || 1;

        if (this.pageControl.value > this.pagesCount)
          this.pageControl.setValue(1);
      }
    });
  }

  @Output()
  actionClick = new Subject<PuiTableActionOutput>();
  @Output()
  rowClick = new Subject<any>();
  @Output()
  query = new Subject<PuiTableQuery>();

  constructor(private readonly router: Router) { }

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

      if (!this.lastQuery) {
        this.lastQuery = { search, page, sort };

      } else {
        this.query.next({
          sort: (this.config.sort && this.config.sort.length) ? sort : undefined,
          search: this.config.search ? search : undefined,
          // if search or sort changed reset page to 1
          page: !this.config.pagination
            ? undefined
            : search !== this.lastQuery.search || !objUtil.equals(this.lastQuery.sort, sort)
              ? 1
              : page,
        });
      }
    });
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