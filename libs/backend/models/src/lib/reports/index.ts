/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, ApiQueryResults, Report, ReportSlide, ReportView, User } from "@pestras/shared/data-model";
import { Model } from "../model";
import { create, CreateReportInput } from "./create";
import { deleteReport } from "./delete";
import { exists, getByTopic, getBySerial, search, titleExists } from "./read";
import { update, UpdateReportInput } from "./update";
import { addView, removeView, updateView, updateViewContent, updateViewsOrder, UpdateReportViewInput } from "./views";
import { addSlide, removeSlide, updateSlide, updateSlidesOrder } from "./slides";

export { CreateReportInput, UpdateReportInput, UpdateReportViewInput };

export class ReportsModel extends Model<Report> {

  // read
  // ------------------------------------------------------------------------
  search: (query: Partial<ApiQuery<Report>>) => Promise<ApiQueryResults<Report>> = search.bind(this);
  getByTopic: (topic: string, user: User, projection?: any) => Promise<Report[]> = getByTopic.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<Report | null> = getBySerial.bind(this);
  exists: (serial: string) => Promise<boolean> = exists.bind(this);
  titleExists: (title: string, exclude?: string) => Promise<boolean> = titleExists.bind(this);

  // create
  // ------------------------------------------------------------------------
  create: (input: CreateReportInput, issuer: User) => Promise<Report> = create.bind(this);

  // update
  // ------------------------------------------------------------------------
  update: (serial: string, input: UpdateReportInput, issuer: User) => Promise<Date> = update.bind(this);

  // slides
  // ------------------------------------------------------------------------
  addSlide: (serial: string, title: string, issuer: User) => Promise<{ slide: ReportSlide; date: Date; }> = addSlide.bind(this);
  updateSlidesOrder: (serial: string, input: string[], issuer: User) => Promise<Date> = updateSlidesOrder.bind(this);
  updateSlide: (serial: string, slide: string, title: string, issuer: User) => Promise<Date> = updateSlide.bind(this);
  removeSlide: (serial: string, slide: string, issuer: User) => Promise<Date> = removeSlide.bind(this);

  // views
  // ------------------------------------------------------------------------
  addView: (serial: string, input: Omit<ReportView, 'serial'>, issuer: User) => Promise<{ view: ReportView; date: Date; }> = addView.bind(this);
  updateViewsOrder: (serial: string, slide: string, input: string[], issuer: User) => Promise<Date> = updateViewsOrder.bind(this);
  updateView: (serial: string, view: string, input: UpdateReportViewInput, issuer: User) => Promise<Date> = updateView.bind(this);
  updateViewContent: (serial: string, view: string, content: string, issuer: User) => Promise<Date> = updateViewContent.bind(this);
  removeView: (serial: string, view: string, issuer: User) => Promise<Date> = removeView.bind(this);

  // delete
  // ------------------------------------------------------------------------
  delete: (serial: string, issuer: User) => Promise<boolean> = deleteReport.bind(this);
}