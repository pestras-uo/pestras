import { AnalysisModel } from '.';

export async function getBySerial(
  this: AnalysisModel,
  serial: string
) {
    return this.col.findOne({ serial });
}