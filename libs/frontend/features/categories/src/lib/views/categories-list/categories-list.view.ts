/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '@pestras/frontend/state';
import { Category } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { Observable, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.view.html'
})
export class CategoriesListView implements OnInit {
  dialogRef: DialogRef | null = null;
  readonly search = new FormControl<string>('', { nonNullable: true });

  categories$!: Observable<Category[]>;

  @Input({ required: true })
  bp!: string;
  @Input()
  editable = false;

  @Output()
  readonly selects = new EventEmitter<Category>();

  ngOnInit(): void {
    this.setCategories();
  }

  constructor(
    private dialog: Dialog,
    private service: CategoriesService
  ) { }

  setCategories() {
    this.categories$ = this.service.getByBlueprint({ blueprint: this.bp })
      .pipe(
        map(list => list.filter(c => Serial.isRoot(c.serial))),
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
    return false;
  }

  closeDialog(success: boolean) {
    this.dialogRef?.close();
    this.dialogRef = null;

    if (success)
      this.setCategories();
  }
}
