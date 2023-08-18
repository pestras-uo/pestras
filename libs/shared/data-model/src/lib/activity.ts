/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityTypes } from "./util/entity-types";

export interface Activity<Payload extends (Record<string, any> | null) = null> {
  serial: string;
  entity: EntityTypes;
  issuer: string;
  method: string;
  create_date: Date;
  payload?: Payload;
}