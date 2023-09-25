/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { DataRecordState, DataStore, DataStoreType, Field, Role } from '@pestras/shared/data-model';
import { SessionState, OrgunitsState, RecordsService } from '@pestras/frontend/state';
import { PuiXlsxService, PuiSideDrawer } from '@pestras/frontend/ui';
import { AdvancedSearchModelItem, filterToQuery } from '../../modals/advanced-search/advanced-search.model';
import { objUtil } from '@pestras/shared/util';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.view.html'
})
export class RecordsListView implements OnChanges {

  readonly rState = DataRecordState;
  readonly columnsControl = new FormControl<string[]>([], { validators: Validators.required, nonNullable: true });

  hasCardsView = false;
  hasTreeView = false;
  view = "table";
  exporting = false;
  isTable!: boolean;
  tab: DataRecordState | "" = "";
  canAdd!: boolean;
  query!: any;
  filters: AdvancedSearchModelItem[] | null = null;
  dialogRef: DialogRef | null = null;
  columns!: string[];

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  topic?: string;
  @Input()
  editable = false;
  @Input()
  search?: any;

  constructor(
    private session: SessionState,
    private orgsState: OrgunitsState,
    private service: RecordsService,
    private xlsx: PuiXlsxService,
    private sideDrawer: PuiSideDrawer,
    private dialog: Dialog
  ) { }

  ngOnChanges() {
    this.isTable = this.dataStore.type === DataStoreType.TABLE;
    this.tab = this.isTable ? (this.tab || DataRecordState.PUBLISHED): "";
    this.columnsControl.setValue(this.dataStore.fields.map(f => f.name));
    this.columns = this.columnsControl.value;
    this.query = this.prepareQuery();

    const session = this.session.get();

    if (session)
      this.canAdd = this.dataStore.collaborators.length
        ? this.dataStore.collaborators.includes(session.serial)
        : session.roles.includes(Role.AUTHOR);

    this.hasCardsView = !!this.dataStore.settings.card_view;
    this.hasTreeView = !!this.dataStore.settings.tree_view;
  }

  setTab(t: DataRecordState) {
    if (this.tab === t)
      return;

    this.tab = t;
    this.query = this.prepareQuery();
  }

  openSideDrawer(tmp: TemplateRef<any>) {
    this.sideDrawer.attach(tmp);
  }

  closeSlideDrawer(filters: AdvancedSearchModelItem[] | null | false = null) {
    this.sideDrawer.close();

    if (filters === false || objUtil.equals(this.filters, filters))
      return;

    this.filters = filters;
    this.query = this.prepareQuery();
  }

  mapField(f: Field) {
    return { name: f.display_name, value: f.name };
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog(cancel = false) {
    this.dialogRef?.close();
    this.dialogRef = null;
    
    if (cancel)
      this.columnsControl.setValue(this.columns);
    else
      this.columns = this.columnsControl.value;
  }

  prepareQuery() {
    // initial query settings
    const query = { ...this.search };

    if (this.filters)
      Object.assign(query, filterToQuery(this.filters));

    if (this.topic)
      query.topic = this.topic;

    if (this.isTable) {

      if (this.tab === DataRecordState.DRAFT)
        query.owner = this.session.get('serial');
    }

    // check if region, orgunit, or user fields are in datastore
    const orgsFields = this.dataStore.fields.filter(f => f.type === 'serial' && f.ref_type === 'orgunit');
    const usersFields = this.dataStore.fields.filter(f => f.type === 'serial' && f.ref_type === 'user');
    const regionsFields = this.dataStore.fields.filter(f => f.type === 'region');

    // get user session
    const user = this.session.get();

    // add filter on orgunits
    if (orgsFields.length && user?.orgunit !== "*")
      for (const f of orgsFields)
        query[f.name] = { $regex: `${user?.orgunit}$` };

    // add filter on regions
    if (regionsFields.length && user?.orgunit !== "*") {
      const org = this.orgsState.get(user?.orgunit || '');

      if (org && org.regions.length)
        for (const f of regionsFields)
          query.$or = org.regions.map(r => ({ [f.name]: { $regex: `${r}$` } }));
    }

    // add filter on users
    if (usersFields.length && user?.orgunit !== "*") {
      if (!user?.roles.some(r => [Role.ADMIN, Role.DATA_ENG, Role.REPORTER].includes(r)))
        for (const f of usersFields)
          query[f.name] = user?.serial;
    }

    return query;
  }

  exportData() {
    this.exporting = true;

    const src = this.tab && this.tab !== DataRecordState.PUBLISHED ? `${this.tab}_${this.dataStore.serial}` : this.dataStore.serial;

    this.service.search({ ds: src }, { ...this.query, limit: 0 })
      .subscribe({
        next: data => {
          this.xlsx.export(data.results, this.dataStore.name);
          this.exporting = false;
        },
        error: e => {
          console.error(e);
          this.exporting = false;
        }
      })
  }
}
