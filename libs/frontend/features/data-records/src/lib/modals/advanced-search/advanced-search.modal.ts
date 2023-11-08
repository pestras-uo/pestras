/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, TypeKind } from '@pestras/shared/data-model';
import { FormControl } from '@angular/forms';
import { AdvancedSearchModelItem } from './advanced-search.model';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search.model.html'
})
export class AdvancedSearchModal implements OnInit {

  fieldsList!: { field: Field; controls: FormControl<any>[]; inverse: FormControl<boolean>; }[];

  @Input({ required: true })
  fields!: Field[];
  @Input()
  filters: AdvancedSearchModelItem[] | null = null;

  @Output()
  done = new EventEmitter<AdvancedSearchModelItem[] | false | null>();

  ngOnInit(): void {

    this.fieldsList = this.fields
      .filter(f =>
        !['unknown', 'location', 'image', 'file'].includes(f.type) &&
        [TypeKind.NONE, TypeKind.ORDINAL, TypeKind.RANGE].includes(f.kind) && !f.system
      )
      .map(f => {
        const options = this.filters?.find(ff => ff.field.name === f.name) ?? null;
        
        return {
          field: f,
          controls: fieldControlsBuilder[f.type](options?.values),
          inverse: new FormControl<boolean>(!!options?.inverse, { nonNullable: true })
        };
      });
  }

  protected output() {
    const query = this.fieldsList
      .filter(entry => ['category', 'serial', 'region'].includes(entry.field.type)
        ? entry.controls[0].value.length > 0
        : entry.controls.some(c => c.value !== null)
      )
      .map(entry => {

        return {
          field: entry.field,
          values: entry.controls.map(c => c.value),
          inverse: entry.inverse.value
        }
      });

    this.done.emit(query.length > 0 ? query : null);
  }
}

const fieldControlsBuilder: any = {
  int: (values: any[] | null) => [new FormControl<number | null>(values?.[0] ?? null), new FormControl<number | null>(values?.[1] ?? null)],
  double: (values: any[] | null) => [new FormControl<number | null>(values?.[0] ?? null), new FormControl<number | null>(values?.[1] ?? null)],
  date: (values: any[] | null) => [new FormControl<Date | null>(values?.[0] ?? null), new FormControl<Date | null>(values?.[1] ?? null)],
  datetime: (values: any[] | null) => [new FormControl<Date | null>(values?.[0] ?? null), new FormControl<Date | null>(values?.[1] ?? null)],
  string: (values: any[] | null) => [new FormControl<string | null>(values?.[0] ?? null)],
  boolean: (values: any[] | null) => [new FormControl<boolean | null>(values?.[0] ?? null)],
  category: (values: any[] | null) => [new FormControl<string[]>(values?.[0] ?? [])],
  serial: (values: any[] | null) => [new FormControl<string[]>(values?.[0] ?? [])],
  region: (values: any[] | null) => [new FormControl<string[]>(values?.[0] ?? [])]
};