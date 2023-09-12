/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, ApiQueryResults, Dashboard, DashboardSlide, DashboardSlideView, User } from "@pestras/shared/data-model";
import { Model } from "../model";
import { exists, getByTopic, getBySerial, search, titleExists } from "./read";
import { create, CreateDashboardInput } from "./create";
import { update, UpdateDashboardInput } from "./update";
import { addSlide, removeSlide, updateSlide, updateSlidesOrder, AddDashboardSlideInput, UpdateDashboardSlideInput } from "./slides";
import { addView, removeView, updateView, updateViewDataViz, updateViewsOrder, UpdateDashbaordViewInput } from "./views";
import { deleteDashboard } from "./delete";

export { CreateDashboardInput, UpdateDashboardInput, AddDashboardSlideInput, UpdateDashboardSlideInput, UpdateDashbaordViewInput };

export class DashboardsModel extends Model<Dashboard> {

  // read
  // ------------------------------------------------------------------------
  search: (query: Partial<ApiQuery<Dashboard>>) => Promise<ApiQueryResults<Dashboard>> = search.bind(this);
  getByTopic: (topic: string, user: User, projection?: any) => Promise<Dashboard[]> = getByTopic.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<Dashboard> = getBySerial.bind(this);
  exists: (serial: string) => Promise<boolean> = exists.bind(this);
  titleExists: (title: string, exclude?: string) => Promise<boolean> = titleExists.bind(this);

  // create
  // ------------------------------------------------------------------------
  create: (input: CreateDashboardInput, issuer: User) => Promise<Dashboard> = create.bind(this);

  // update
  // ------------------------------------------------------------------------
  update: (serial: string, input: UpdateDashboardInput, issuer: User) => Promise<Date> = update.bind(this);
  
  // slides
  // ------------------------------------------------------------------------
  addSlide: (serial: string, input: AddDashboardSlideInput, issuer: User) => Promise<{ slide: DashboardSlide; date: Date; }> = addSlide.bind(this);
  updateSlidesOrder: (serial: string, input: string[], issuer: User) => Promise<Date> = updateSlidesOrder.bind(this);
  updateSlide: (serial: string, slide: string, input: UpdateDashboardSlideInput, issuer: User) => Promise<Date> = updateSlide.bind(this);
  removeSlide: (serial: string, slide: string, issuer: User) => Promise<Date> = removeSlide.bind(this);
  
  // data viz
  // ------------------------------------------------------------------------
  addView: (serial: string, input: Omit<DashboardSlideView, 'serial'>, issuer: User) => Promise<{ view: DashboardSlideView; date: Date; }> = addView.bind(this);
  updateViewsOrder: (serial: string, slide: string, input: string[], issuer: User) => Promise<Date> = updateViewsOrder.bind(this);
  updateView: (serial: string, view: string, input: UpdateDashbaordViewInput, issuer: User) => Promise<Date> = updateView.bind(this);
  updateViewDataViz: (serial: string, view: string, dataViz: string, issuer: User) => Promise<Date> = updateViewDataViz.bind(this);
  removeView: (serial: string, view: string, issuer: User) => Promise<Date> = removeView.bind(this);

  // delete
  // ------------------------------------------------------------------------
  delete: (serial: string, issuer: User) => Promise<boolean> = deleteDashboard.bind(this);
}