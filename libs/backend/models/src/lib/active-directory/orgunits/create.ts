import { EntityTypes, Orgunit } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { OrgunitsModel } from ".";

export type CreateOrgunitInput = Pick<Orgunit, 'name' | 'class' | 'regions'> & { parent?: string; };

export async function create(this: OrgunitsModel, input: CreateOrgunitInput, issuer: string) {
  const date = new Date();

  const orgunit: Orgunit = {
    serial: Serial.gen("ORG", input.parent),
    name: input.name,
    class: input.class,
    logo: null,
    regions: input.regions,
    create_date: date, 
    last_modified: date
  };

  await this.col.insertOne(orgunit);

  this.pubSub.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'create',
    serial: orgunit.serial,
    entity: EntityTypes.ORGUNIT
  }, {});

  return orgunit;
}