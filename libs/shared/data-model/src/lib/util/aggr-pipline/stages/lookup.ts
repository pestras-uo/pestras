// import { AggrPiplineStage, AggrStageTypes } from '.';
// import { ArrayType, TypedEntity } from '../../data-types';
// import { AggrPipeline } from '../pipeline';

// export interface LookupStageBaseOptions {
//   from: string;
//   as: string;
// }

// export interface LookupStageOptions extends LookupStageBaseOptions {
//   localField: string;
//   foreignField: string;
// }

// export interface LookupStagePiplineOptions extends LookupStageBaseOptions {
//   let: Record<string, string>;
//   pipeline: AggrPiplineStage[] | AggrPipeline;
// }

// export class LookupStage extends AggrPiplineStage<LookupStageOptions | LookupStagePiplineOptions> {

//   constructor(
//     options: LookupStageOptions | LookupStagePiplineOptions,
//     inputState: TypedEntity[] = [],
//     readonly joinState: TypedEntity[] = []
//   ) {
//     super(AggrStageTypes.LOOKUP, inputState);

//     this.options = options;
//   }

//   override outputType(): TypedEntity[] {
//     return this.inputState.concat({
//       name: this.options.as,
//       type: {
//         name: 'array',
//         valueType: {
//           name: 'object',
//           valueType: this.isPipelineLookup(this.options)
//             ? this.options.pipeline instanceof AggrPipeline
//               ? this.options.pipeline.outputType(this.joinState)
//               : new AggrPipeline(this.options.pipeline).outputType(this.joinState)
//             : null
//         }
//       } as ArrayType
//     });
//   }

//   isSimpleLookup(options: any): options is LookupStageOptions {
//     return !!options.localField && !!options.foreignField
//   }

//   isPipelineLookup(options: any): options is LookupStagePiplineOptions {
//     return !!options.let && !!options.pipleline
//   }

//   compile() {
//     return {
//       $lookup: this.isPipelineLookup(this.options)
//         ? {
//           from: this.options.from,
//           as: this.options.as,
//           let: this.options.let,
//           pipeline: this.options.pipeline instanceof AggrPipeline
//             ? this.options.pipeline.compile()
//             : new AggrPipeline(this.options.pipeline).compile()
//         }
//         : {
//           from: this.options.from,
//           as: this.options.as,
//           localField: this.options.localField,
//           foreignField: this.options.foreignField
//         }
//     };
//   }
// }