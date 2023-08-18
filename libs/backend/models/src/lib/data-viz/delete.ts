import { DataVizModel } from ".";

export async function deleteDataViz(
  this: DataVizModel,
  serial: string
) {
  await this.col.deleteOne({ serial });

  return true;
}

export async function deleteManyDataViz(
  this: DataVizModel,
  serials: string[]
) {
  await this.col.deleteMany({ serial: { $in: serials } });

  return true;
}