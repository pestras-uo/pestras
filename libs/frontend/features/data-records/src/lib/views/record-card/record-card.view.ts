/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { TableDataRecord, DataStore, Field, DataRecordState } from '@pestras/shared/data-model';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.view.html',
  styles: [
  ]
})
export class RecordCardView implements OnInit {

  titleField!: Field | null;
  image: string | null = null;
  detailsFields: Field[] = [];

  @Input({ required: true })
  ds!: DataStore;
  @Input({ required: true })
  topic?: string;
  @Input({ required: true })
  record!: TableDataRecord;
  @Input()
  state: DataRecordState | "" = "";

  ngOnInit(): void {
    this.titleField = this.ds.fields.find(f => f.name === this.ds.settings.card_view?.title) ?? null;
    this.detailsFields = this.ds.fields.filter(f => this.ds.settings.card_view?.details.includes(f.name)) ?? null;
    const imageField = this.ds.fields.find(f => f.name === this.ds.settings.card_view?.image) ?? null;

    this.image = imageField
      ? this.record[imageField.name] as string
      : null;
  }
}
