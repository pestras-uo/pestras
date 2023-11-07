import { Category, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { CategoriesModel } from ".";

export type CreateCategoryInput = Pick<Category, 'title' | 'blueprint' | 'type' | 'value' | 'levels'> & { parent: string | null };

export async function create(
  this: CategoriesModel,
  input: CreateCategoryInput,
  issuer: User
) {
  const date = new Date();
  const serial = Serial.gen('CAT', input.parent ?? '');

  await this.col.insertOne({
    serial,
    title: input.title,
    blueprint: input.blueprint,
    type: input.type,
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