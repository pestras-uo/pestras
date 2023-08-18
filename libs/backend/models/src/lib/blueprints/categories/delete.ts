import { EntityTypes } from "@pestras/shared/data-model";
import { CategoriesModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function deleteCategory(this: CategoriesModel, serial: string, issuer: string) {
  if ((await this.col.countDocuments({ serial: new RegExp(`_${serial}$`) })) > 0)
    throw new HttpError(HttpCode.FORBIDDEN, 'subCategoriesFound');

  await this.col.deleteOne({ serial });

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: new Date(),
    method: 'delete',
    serial,
    entity: EntityTypes.CATEGORY
  });

  return true;
}