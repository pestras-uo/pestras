import { ContentViewsModel } from ".";

export async function deleteEntityContentView(this: ContentViewsModel, entity: string) {
  await this.col.deleteOne({ entity });

  return true;
}