import { DataVizModel } from '.';

export async function getBySerial(
  this: DataVizModel,
  serial: string
) {
    return this.col.findOne({ serial });
}