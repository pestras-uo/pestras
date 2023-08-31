/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { range } from '@pestras/shared/util';
import { distinctUntilChanged } from 'rxjs';
import { untilDestroyed } from '../../reactive';

@Component({
  selector: 'pui-table-pagination',
  template: `
    <button [class.disabled]="page.value === 1"  class="btn-small btn-icon btn-round btn-outline" (click)="prev()">
      <i [puiIcon]="('rtl' | isDir) ? 'navigate_next' : 'navigate_before'" size="small"></i>
    </button>
    <div class="fc fc-round">
      <select class="select-page" #pagesInput [formControl]="page">
        <option *ngFor="let page of pages" [value]="page">{{page}}</option>
      </select>
    </div>
    <p class="bold">{{pages.length}} / {{count}}</p>
    <button [class.disabled]="page.value >= pages.length" class="btn-small btn-icon btn-round btn-outline" (click)="next()">
      <i [puiIcon]="('rtl' | isDir) ? 'navigate_before' : 'navigate_next'" size="small"></i>
    </button>
  `,
  styles: [`
    :host {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .fc {
      width: 56px;
    }

    .select-page {
      min-width: 0px;
    }
  `],
})
export class PuiTablePagination implements OnChanges, OnInit {
  private ud = untilDestroyed();

  readonly page = new FormControl<number>(1, { nonNullable: true });

  pages!: number[];

  @Input({ required: true })
  count!: number;
  @Input({ required: true })
  pageSize!: number;

  @Output()
  selects = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['count'] || changes['pageSize']) {
      this.page.setValue(1);

      const pagesCount = Math.ceil(this.count / this.pageSize) ?? 1;
      this.pages = pagesCount
        ? range(1, pagesCount)
        : [1];
    }
  }

  ngOnInit(): void {
    this.page.valueChanges
      .pipe(this.ud(), distinctUntilChanged())
      .subscribe(page => this.selects.emit(page));
  }

  next() {
    this.page.setValue(+this.page.value + 1)
  }

  prev() {
    this.page.setValue(+this.page.value - 1)
  }
}
