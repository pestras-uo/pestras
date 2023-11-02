import { Category, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { CategoriesModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateCategoryInput = Pick<Category, 'title' | 'blueprint' | 'ordinal' | 'value' | 'levels'> & { parent: string | null };

export async function create(
  this: CategoriesModel,
  input: CreateCategoryInput,
  issuer: User
) {
  if (await this.titleExists(input.title))
    throw new HttpError(HttpCode.CONFLICT, 'titleAlreadyExists');

  const date = new Date();
  const serial = Serial.gen('CAT', input.parent ?? '');

  await this.col.insertOne({
    serial,
    title: input.title,
    blueprint: input.blueprint,
    ordinal: input.ordinal,
    value: input.value,
    levels: input.levels,
    level: Serial.countLevels(input.parent),
    create_date: date,
    last_modified: date
  });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'create',
    serial,
    entity: EntityTypes.CATEGORY
  }, {
    orgunits: [issuer.orgunit]
  });

  return this.getBySerial(serial);
}