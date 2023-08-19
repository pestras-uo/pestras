import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsRouter } from './records.router';
import { DataRecord, DataStore } from '@pestras/shared/data-model';
import { DataStoreResolver, RecordResolver } from '@pestras/frontend/state';
import { DetailsPage } from './details/details.page';
import { AddFormPage } from './add-form/add-form.page';
import { UpdateFormPage } from './update-form/update-form.page';


const routes: Routes = [{
  path: '', component: RecordsRouter, children: [
    { path: ':dataStore/add', component: AddFormPage, resolve: { dataStore: DataStoreResolver<DataStore> } },
    { path: ':topic/:dataStore/add', component: AddFormPage, resolve: { dataStore: DataStoreResolver<DataStore> } },
    { path: ':topic/:dataStore/:record/update', component: UpdateFormPage, resolve: { dataStore: DataStoreResolver<DataStore>, record: RecordResolver<DataRecord> } },
    { path: ':dataStore/:record', component: DetailsPage, resolve: { dataStore: DataStoreResolver<DataStore> } },
    { path: ':topic/:dataStore/:record', component: DetailsPage, resolve: { dataStore: DataStoreResolver<DataStore> } },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicsRoutingModule { }
