import { RegionsModel } from ".";

export async function nameExists(this: RegionsModel, name: string, exclude?: string) {
  return (await this.col.countDocuments({
    name,
    serial: { $nin: exclude ? [exclude] : [] }
  })) > 0;
}