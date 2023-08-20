import { AggrPiplineStage, CastModifer, ConvertOperation, SelectStage, SetStage } from "../../util";
import { Field, createField } from "../fields";

export interface WebServiceSelection {
  field: string;
  as: string;
  display_name: string;
  type: CastModifer;
  onError: unknown;
  onNull: unknown;
}

export function selectionsToPipeline(selections: WebServiceSelection[]) {

  const stages: Array<AggrPiplineStage> = [];

  // select fields
  stages.push(new SelectStage({ fields: selections.map(s => ({ name: s.field, state: s.as || s.field })) }));

  // cast fields types
  stages.push(new SetStage({
    fields: selections
      .map(o => ({
        field: o.as || o.field,
        operation: 'convert',
        display_name: o.display_name,
        options: {
          input: o.as || o.field,
          to: o.type,
          onError: o.onError,
          onNull: o.onNull
        }
      }))
  }));

  return stages;
}


export function getFieldsFromSelections(selections: WebServiceSelection[]) {

  const fields: Field[] = [];

  for (const selection of selections) {
    fields.push(createField({
      ...ConvertOperation.OutputType({
        input: selection.as || selection.field,
        to: selection.type,
        onError: selection.onError,
        onNull: selection.onNull
      }),
      name: selection.as || selection.field,
      display_name: selection.display_name
    }));
  }

  return fields;
}