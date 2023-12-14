import { ContentView, EntityContentViews } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getByEntity, getView } from "./read";
import { create } from "./create";
import { addView, removeView, updateViewsOrder, updateView, updateViewContent } from "./views";
import { deleteEntityContentView } from "./delete";

export class ContentViewsModel extends Model<EntityContentViews> {

  getByEntity: (entity: string) => Promise<EntityContentViews | null> = getByEntity.bind(this);
  getView: (entity: string, view: string) => Promise<ContentView | null> = getView.bind(this);

  create: (entity: string) => Promise<EntityContentViews> = create.bind(this);

  addView: (entity: string, input: Omit<ContentView, 'serial'>) => Promise<ContentView> = addView.bind(this);
  updateViewsOrder: (entity: string, views: string[]) => Promise<boolean> = updateViewsOrder.bind(this);
  updateView: (entity: string, view: string, input: Pick<ContentView, 'title' | 'sub_title' | 'content'>) => Promise<boolean> = updateView.bind(this);
  updateViewContent: (entity: string, view: string, content: string | null) => Promise<boolean> = updateViewContent.bind(this);
  removeView: (entity: string, view: string) => Promise<boolean> = removeView.bind(this);

  delete: (entity: string) => Promise<boolean> = deleteEntityContentView.bind(this);
}