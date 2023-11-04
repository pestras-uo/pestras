/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';
import { Category } from '@pestras/shared/data-model';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, map, startWith, switchMap } from 'rxjs';
import { CategoriesService } from '@pestras/frontend/state';
import { Serial } from '@pestras/shared/util';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.view.html'
})
export class CategoryDetailsView implements OnChanges {

  private dialogRef: DialogRef | null = null;

  readonly search = new FormControl<string>('', { nonNullable: true });
  readonly page$ = new BehaviorSubject<number>(1);

  levels!: number;
  isLastLevel!: boolean;

  branches$!: Observable<Category[]>;

  parent!: Category;

  @Input({ required: true })
  bp!: string;
  @Input({ required: true })
  selected!: Category[];
  @Input()
  editable = false;

  @Output()
  readonly selects = new EventEmitter<Category[]>();

  constructor(
    private readonly dialog: Dialog,
    private readonly service: CategoriesService
  ) { }

  ngOnChanges(): void {
    this.levels = this.selected[0].levels ?? 1;
    this.parent = this.selected[this.selected.length - 1];
    this.isLastLevel = this.levels === this.selected.length;
    this.setBranches();
  }

  setBranches() {
    this.branches$ = this.service.getByParent({ serial: this.parent.serial, level: this.parent.level + 1 })
      .pipe(
        map(cats => cats.filter(cat => Serial.countLevels(cat.serial) === this.selected.length + 1)),
        switchMap(cats => {
          return this.search.valueChanges
            .pipe(
              startWith(''),
              map(search => search ? cats.filter(cat => cat.title.includes(search)) : cats)
            );
        })
      );
  }

  openDialog(e: MouseEvent, ref: TemplateRef<any>, data?: any) {
    e.stopPropagation();
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeDialog(success: boolean) {
    this.dialogRef?.close();
    this.dialogRef = null;

    if (success)
      this.setBranches();
  }

  goToBranch(branch: Category) {
    if (!this.isLastLevel)
      this.selects.emit([...this.selected, branch]);
  }
}
