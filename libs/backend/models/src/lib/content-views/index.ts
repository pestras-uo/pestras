import { EntityContentViews } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getByEntity, getView } from "./read";
import { create } from "./create";
import { addView, removeView, updateViewsOrder, updateView, updateViewContent } from "./views";
import { deleteEntityContentView } from "./delete";

export class ContentViewsModel extends Model<EntityContentViews> {

  getByEntity = getByEntity.bind(this);
  getView = getView.bind(this);

  create = create.bind(this);

  addView = addView.bind(this);
  updateViewsOrder = updateViewsOrder.bind(this);
  updateView = updateView.bind(this);
  updateViewContent = updateViewContent.bind(this);
  removeView = removeView.bind(this);

  delete = deleteEntityContentView.bind(this);
}