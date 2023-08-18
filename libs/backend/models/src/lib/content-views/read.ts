import { ContentViewsModel } from ".";

export function getByEntity(this: ContentViewsModel, entity: string) {
  return this.col.findOne({ entity });
}

export async function getView(this: ContentViewsModel, entity: string, view: string) {
  const c = await this.getByEntity(entity);

  return c?.views.find(v => v.serial === view) ?? null;
}