import { Category } from "@pestras/shared/data-model"
import { Model } from "../../model";
import { create } from './create';
import { update } from "./update";
import { titleExists } from "./util";
import { getBySerial, getAll } from "./read";
import { deleteCategory } from "./delete";

export { CreateCategoryInput } from './create';
export { UpdateCategoryInput } from './update';

export class CategoriesModel extends Model<Category> {

  // read
  // -----------------------------------------------------------------------------------
  getAll = getAll.bind(this);
  getBySerial = getBySerial.bind(this);

  // util
  // ------------------------------------------------------------------------------------
  titleExists = titleExists.bind(this);

  // create
  // ------------------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // ------------------------------------------------------------------------------------
  update = update.bind(this);

  // delete
  // ------------------------------------------------------------------------------------
  delete = deleteCategory.bind(this);
}