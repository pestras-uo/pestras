// import { AggrPiplineStage, AggrStageTypes } from ".";
// import { TypedEntity } from "../../data-types";
// import { MergeObjectsOperation, MergeObjectsOperationOptions } from "../operations/merge-objects";

// export type ReplaceWithStageOptions = MergeObjectsOperationOptions;

// export class ReplaceWithStage extends AggrPiplineStage<MergeObjectsOperationOptions> {

//   constructor(options: MergeObjectsOperationOptions, inputState: TypedEntity[] = []) {
//     super(AggrStageTypes.REPLACE_WITH, inputState);

//     this.options = options;
//   }

//   override outputType(): TypedEntity[] {
//     const props = new Map<string, TypedEntity>();

//     for (const name of this.options.fields) {
//       const field = this.inputState.find(f => f.name === name);

//       if (!field)
//         continue;

//       if (Array.isArray(field.type.sub_type))
//         for (const prop of field.type.sub_type)
//           props.set(prop.name, prop);
//     }

//     return [...props.entries()].map(e => ({ name: e[0], display_name: e[1].display_name, type: e[1].type }));
//   }

//   compile() {
//     return {
//       $replaceWith: new MergeObjectsOperation(this.options).compile()
//     };
//   }
// }