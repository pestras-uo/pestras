import { Category, User } from "@pestras/shared/data-model"
import { Model } from "../../model";
import { create, CreateCategoryInput } from './create';
import { update, UpdateCategoryInput } from "./update";
import { titleExists } from "./util";
import { getBySerial, getByParent, getByBlueprint } from "./read";
import { deleteCategory } from "./delete";

export { CreateCategoryInput, UpdateCategoryInput };

export class CategoriesModel extends Model<Category> {

  // read
  // -----------------------------------------------------------------------------------
  getByParent: (parent: string) => Promise<Category[]> = getByParent.bind(this);
  getBySerial: (serial: string, projection?: Document) => Promise<Category | null> = getBySerial.bind(this);
  getByBlueprint: (bp: string, projection?: Document) => Promise<Category[]> = getByBlueprint.bind(this);

  // util
  // ------------------------------------------------------------------------------------
  titleExists: (title: string, serial?: string) => Promise<boolean> = titleExists.bind(this);

  // create
  // ------------------------------------------------------------------------------------
  create: (input: CreateCategoryInput, issuer: User) => Promise<Category | null> = create.bind(this);

  // update
  // ------------------------------------------------------------------------------------
  update: (serial: string, input: UpdateCategoryInput, issuer: string) => Promise<Date> = update.bind(this);

  // delete
  // ------------------------------------------------------------------------------------
  delete: (serial: string, issuer: string) => Promise<boolean> = deleteCategory.bind(this);
}