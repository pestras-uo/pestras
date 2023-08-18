import { DashboardSlide, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DashboardsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type AddDashboardSlideInput = Pick<DashboardSlide, 'title' | 'play_time'>;

export async function addSlide(
  this: DashboardsModel,
  serial: string,
  input: AddDashboardSlideInput,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'dashboardNotFound');

  const date = new Date();
  const slide: DashboardSlide = {
    serial: Serial.gen("SLIDE"),
    ...input,
    views_order: [],
  }

  await this.col.updateOne({ serial }, {
    $push: { slides: slide, slides_order: slide.serial },
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addSlide',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { slide }
  });

  return { slide, date };
}



export type UpdateDashboardSlideInput = Pick<DashboardSlide, 'title' | 'play_time'>;

export async function updateSlide(
  this: DashboardsModel,
  serial: string,
  slide: string,
  input: UpdateDashboardSlideInput,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial, 'slides.serial': slide }, {
    $set: {
      'slides.$.title': input.title,
      'slides.$.play_time': input.play_time,
      last_modified: date
    }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateSlide',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: slide, change: input }
  });

  return date;
}


export async function updateSlidesOrder(
  this: DashboardsModel,
  serial: string,
  input: string[],
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { slides_order: input, last_modified: date } });

  this.pubSub.emitActivity({
    create_date: date,
    issuer: issuer.serial,
    method: 'updateSlidesOrder',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { slides_order: input }
  });

  return date;
}



export async function removeSlide(
  this: DashboardsModel,
  serial: string,
  slide: string,
  issuer: User
) {

  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne({ serial }, {
    $pull: { slides: { serial: slide }, slides_order: slide, views: { slide } },
    $set: { last_modified: date }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeSlide',
    serial,
    entity: EntityTypes.DASHBOARD,
    payload: { serial: slide }
  });

  return date;
}