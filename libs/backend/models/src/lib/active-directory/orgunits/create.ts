import { EntityTypes, Orgunit, OrgunitsApi } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { OrgunitsModel } from ".";

export async function create(this: OrgunitsModel, input: OrgunitsApi.Create.Body, issuer: string) {
  const date = new Date();

  const orgunit: Orgunit = {
    serial: Serial.gen("ORG", input.parent ?? ''),
    name: input.name,
    is_partner: input.is_partner,
    class: input.class,
    logo: null,
    regions: input.regions,
    create_date: date, 
    last_modified: date
  };

  await this.col.insertOne(orgunit);

  this.channel.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'create',
    serial: orgunit.serial,
    entity: EntityTypes.ORGUNIT
  }, {});

  return orgunit;
}