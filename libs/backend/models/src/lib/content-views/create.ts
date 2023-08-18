import { EntityContentViews } from "@pestras/shared/data-model";
import { ContentViewsModel } from ".";

export async function create(this: ContentViewsModel, entity: string) {
  const cv: EntityContentViews = {
    entity,
    views: [],
    views_order: []
  }

  await this.col.insertOne(cv);

  return cv;
}