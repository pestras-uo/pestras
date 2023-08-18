// import { AggrPiplineStage, AggrStageTypes } from ".";
// import { TypedEntity } from "../../data-types";
// import { AggrPipeline } from "../pipeline";

// export type FacetStageOptions = Array<{ field: string; pipeline: Array<AggrPiplineStage> | AggrPipeline }>;

// export class FacetStage extends AggrPiplineStage<FacetStageOptions> {

//   constructor(options: FacetStageOptions, inputState: TypedEntity[] = ) {
//     super(AggrStageTypes.FACET, inputState);

//     this.options = options;
//   }

//   override outputType(): TypedEntity[] {
//     return this.options.map(o => {
//       return {
//         name: o.field,
//         type: {
//           name: 'array',
//           valueType: {
//             name: 'object',
//             valueType: o.pipeline instanceof AggrPipeline
//               ? o.pipeline.outputType(this.inputState)
//               : new AggrPipeline(o.pipeline).outputType(this.inputState)
//           }
//         }
//       };
//     });
//   }

//   compile() {
//     let facet: any = {};

//     for (const op of this.options) {
//       facet[op.field] = op.pipeline instanceof AggrPipeline
//         ? op.pipeline.compile()
//         : new AggrPipeline(op.pipeline).compile();
//     }

//     return {
//       $facet: facet
//     };
//   }
// }