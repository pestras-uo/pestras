import { EntityTypes, ReportView, User } from "@pestras/shared/data-model";
import { ReportsModel } from ".";
import { Serial } from '@pestras/shared/util';
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function addView(
  this: ReportsModel,
  serial: string,
  input: Omit<ReportView, 'serial'>,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();
  const view: ReportView = {
    serial: Serial.gen("SEC"),
    ...input
  }

  await this.col.updateOne({ serial, 'slides.serial': input.slide }, {
    $push: { views: view, 'slides.$.views_order': view.serial },
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addView',
    serial,
    entity: EntityTypes.REPORT,
    payload: { view }
  });

  return { view, date };
}



export async function updateViewsOrder(
  this: ReportsModel,
  serial: string,
  slide: string,
  input: string[],
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'slides.serial': slide }, {
    $set: {
      'slides.$.views_order': input,
      last_modified: date
    }
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateViewsOrder',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: slide, views_order: input }
  });

  return date;
}


export type UpdateReportViewInput = Pick<ReportView, 'title' | 'sub_title'>;

export async function updateView(
  this: ReportsModel,
  serial: string,
  view: string,
  input: UpdateReportViewInput,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'views.serial': view }, {
    $set: {
      'views.$.title': input.title,
      'views.$.sub_title': input.sub_title,
      last_modified: date
    }
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateView',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: view, change: input }
  });

  return date;
}


export async function updateViewContent(
  this: ReportsModel,
  serial: string,
  view: string,
  content: string,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'views.serial': view }, {
    $set: {
      'views.$.content': content,
      last_modified: date
    }
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateViewContent',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: view, change: { content } }
  });

  return date;
}



export async function removeView(
  this: ReportsModel,
  serial: string,
  view: string,
  issuer: User
) {
  const report = await this.getBySerial(serial, { views: 1 });

  if (!report)
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const viewToRemove = report.views.find(v => v.serial === view);
  const date = new Date();

  if (!viewToRemove)
    return date;

  await this.col.updateOne({
    serial, 'slides.serial': viewToRemove.slide
  }, {
    $pull: { views: { serial: view }, 'slides.$.views_order': view },
    $set: { last_modified: date }
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeView',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: view }
  });

  return date;
}