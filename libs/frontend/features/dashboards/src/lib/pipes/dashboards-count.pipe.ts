/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform } from "@angular/core";
import { DashboardsState } from "@pestras/frontend/state";

@Pipe({
  name: 'dashboardsCount'
})
export class DashboardsCountPipe implements PipeTransform {

  constructor(private state: DashboardsState) {}

  transform(value: null) {
    return this.state.count();
  }
}