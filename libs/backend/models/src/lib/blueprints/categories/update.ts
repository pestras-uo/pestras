import { Category, EntityTypes } from "@pestras/shared/data-model";
import { CategoriesModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type UpdateCategoryInput = Pick<Category, 'title' | 'value' | 'ordinal'>;

export async function update(
  this: CategoriesModel,
  serial: string, 
  input: UpdateCategoryInput,
  issuer: string
) {
  const date = new Date();

  const cat = await this.getBySerial(serial);

  if (!cat)
    throw new HttpError(HttpCode.NOT_FOUND, 'categoryNotFound');

  if (cat.ordinal !== input.ordinal) {
    if (await (this.col.countDocuments({ serial: new RegExp(`_${serial}$`)})) > 0)
      throw new HttpError(HttpCode.FORBIDDEN, 'changeOrdinalNotAllowed');
  }

  await this.col.updateOne(
    { serial },
    { $set: { ...input, last_modified: date } }
  );

  this.channel.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.CATEGORY,
    payload: input
  });

  return date;
}