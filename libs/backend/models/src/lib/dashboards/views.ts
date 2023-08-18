import { DashboardSlideView, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DashboardsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function addView(
  this: DashboardsModel,
  serial: string,
  input: Omit<DashboardSlideView, 'serial'>,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();
  const view: DashboardSlideView = {
    serial: Serial.gen("VIW"),
    ...input
  };

  await this.col.updateOne({ serial, 'slides.serial': view.slide }, {
    $push: { views: view, 'slides.$.views_order': view.serial },
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addView',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { view }
  });

  return { view, date }
}



export async function updateViewsOrder(
  this: DashboardsModel,
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

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateViewsOrder',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: slide, views_order: input }
  });

  return date;
}



export type UpdateDashbaordViewInput = Omit<DashboardSlideView, 'data_viz' | 'slide' | 'serial'>

export async function updateView(
  this: DashboardsModel,
  serial: string,
  view: string,
  input: UpdateDashbaordViewInput,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'views.serial': view }, {
    $set: {
      'views.$.title': input.title,
      'views.$.sub_title': input.sub_title,
      'views.$.size': input.size,
      'views.$.mode': input.mode,
      last_modified: date
    }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateView',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: view, change: input }
  });

  return date
}

export async function updateViewDataViz(
  this: DashboardsModel,
  serial: string,
  view: string,
  dataViz: string,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'views.serial': view }, {
    $set: {
      'view.$.data_viz': dataViz,
      last_modified: date
    }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateViewDataViz',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: view, change: { dataViz } }
  });

  return date;
}

export async function removeView(
  this: DashboardsModel,
  serial: string,
  view: string,
  issuer: User
) {
  const dashboard = await this.getBySerial(serial, { views: 1 });

  if (!dashboard)
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();
  const viewToRemove = dashboard.views.find(v => v.serial === view);

  if (!viewToRemove)
    return date;

  await this.col.updateOne({
    serial,
    'slides.serial': viewToRemove.slide
  }, {
    $pull: { views: { serial: view }, 'slides.$.views_order': view },
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeView',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: view }
  });

  return date;
}