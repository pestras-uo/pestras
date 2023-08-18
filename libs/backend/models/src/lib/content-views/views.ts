import { ContentView } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { ContentViewsModel } from ".";

export async function addView(
  this: ContentViewsModel,
  entity: string,
  input: Omit<ContentView, 'serial'>
) {
  const cv: ContentView = {
    serial: Serial.gen('CVW'),
    ...input
  };

  await this.col.updateOne({ entity }, {
    $push: {
      views: cv,
      views_order: cv.serial
    } 
  });

  return cv;
}

export async function updateViewsOrder(
  this: ContentViewsModel,
  entity: string,
  views: string[]
) {
  await this.col.updateOne({ entity }, { $set: { views_order: views } });

  return true;
}

export async function updateView(
  this: ContentViewsModel,
  entity: string,
  view: string,
  input: Pick<ContentView, 'title' | 'sub_title'>
) {

  await this.col.updateOne({ entity, 'views.serial': view }, {
    $set: {
      'views.$.title': input.title,
      'views.$.sub_title': input.sub_title
    } 
  });

  return true;
}

export async function updateViewContent(
  this: ContentViewsModel,
  entity: string,
  view: string,
  content: string | null
) {

  await this.col.updateOne({ entity, 'views.serial': view }, {
    $set: { 'views.$.content': content } 
  });

  return true;
}

export async function removeView(
  this: ContentViewsModel,
  entity: string,
  view: string
) {

  await this.col.updateOne({ entity }, {
    $pull: { views: { serial: view } } 
  });

  return true;
}