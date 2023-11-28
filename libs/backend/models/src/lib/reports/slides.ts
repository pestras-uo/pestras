import { EntityTypes, ReportSlide, User } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { ReportsModel } from '.';
import { HttpError, HttpCode } from '@pestras/backend/util';

export async function addSlide(
  this: ReportsModel,
  serial: string,
  title: string,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();
  const slide: ReportSlide = {
    serial: Serial.gen('TAB'),
    title,
    views_order: [],
    data_store: '',
  };

  await this.col.updateOne(
    { serial },
    {
      $push: { slides: slide, slides_order: slide.serial },
      $set: { last_modified: date },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addSlide',
    serial,
    entity: EntityTypes.REPORT,
    payload: { slide },
  });

  return { slide, date };
}

export async function updateSlidesOrder(
  this: ReportsModel,
  serial: string,
  input: string[],
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { slides_order: input, last_modified: date } }
  );

  this.channel.emitActivity({
    create_date: date,
    issuer: issuer.serial,
    method: 'updateSlidesOrder',
    serial,
    entity: EntityTypes.REPORT,
    payload: { slides_order: input },
  });

  return date;
}

export async function updateSlide(
  this: ReportsModel,
  serial: string,
  slide: string,
  title: string,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne(
    { serial, 'slides.serial': slide },
    {
      $set: {
        'slides.$.title': title,
        last_modified: date,
      },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'updateSlide',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: slide, change: { title } },
  });

  return date;
}

export async function removeSlide(
  this: ReportsModel,
  serial: string,
  slide: string,
  issuer: User
) {
  if (!(await this.exists(serial)))
    throw new HttpError(HttpCode.NOT_FOUND, 'reportNotFound');

  const date = new Date();

  await this.col.updateOne(
    { serial },
    {
      $pull: {
        slides: { serial: slide },
        slides_order: slide,
        views: { slide },
      },
      $set: { last_modified: date },
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeSlide',
    serial,
    entity: EntityTypes.REPORT,
    payload: { serial: slide },
  });

  return date;
}
