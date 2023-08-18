import { OrgunitsModel } from ".";

export async function exists(this: OrgunitsModel, serial: string) {
  return (await this.col.countDocuments({ serial })) > 0;
}