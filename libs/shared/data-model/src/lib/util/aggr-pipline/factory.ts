import { BucketStage, BucketStageOptions, FillStage, FillStageOptions, GroupStage, GroupStageOptions, JoinStage, JoinStageOptions, LimitStage, LimitStageOptions, MatchStage, MatchStageOptions, MergeStage, MergeStageOptions, OutStage, OutStageOptions, SampleStage, SampleStageOptions, SelectStage, SelectStageOptions, SetStage, SetStageOptions, SetWindowFieldsStage, SetWindowFieldsStageOptions, SkipStage, SkipStageOptions, SortStage, SortStageOptions, UnsetStage, UnsetStageOptions, UnwindStage, UnwindStageOptions } from ".";
import { TypedEntity } from "../data-types";
import { AggrPipeline } from "./pipeline";
import { AggrPiplineStage, AggrStageTypes, IAggrPiplineStage } from "./stages";
import { UnionStage, UnionStageOptions } from "./stages/union";

export function aggrStageFactory(
  stage: IAggrPiplineStage,
  initState: TypedEntity[],
  getState?: (dataStore: string) => TypedEntity[]
): AggrPiplineStage | null {

  if (isOptionsOfStage<BucketStageOptions>(stage, AggrStageTypes.BUCKET))
    return new BucketStage(stage.options, initState);

  else if (isOptionsOfStage<FillStageOptions>(stage, AggrStageTypes.FILL))
    return new FillStage(stage.options, initState);

  else if (isOptionsOfStage<GroupStageOptions>(stage, AggrStageTypes.GROUP))
    return new GroupStage(stage.options, initState);

  else if (isOptionsOfStage<JoinStageOptions>(stage, AggrStageTypes.JOIN))
    return new JoinStage(stage.options, initState, getState ? getState(stage.options.dataStore) : []);

  else if (isOptionsOfStage<LimitStageOptions>(stage, AggrStageTypes.LIMIT))
    return new LimitStage(stage.options, initState);

  else if (isOptionsOfStage<MatchStageOptions>(stage, AggrStageTypes.MATCH))
    return new MatchStage(stage.options, initState);

  else if (isOptionsOfStage<MergeStageOptions>(stage, AggrStageTypes.MERGE))
    return new MergeStage(stage.options, initState);

  else if (isOptionsOfStage<OutStageOptions>(stage, AggrStageTypes.OUT))
    return new OutStage(stage.options, initState);

  // else if (isOptionsOfStage<ReplaceWithStageOptions>(stage, AggrStageTypes.REPLACE_WITH))
  //   return new ReplaceWithStage(stage.options, initState);

  else if (isOptionsOfStage<SampleStageOptions>(stage, AggrStageTypes.SAMPLE))
    return new SampleStage(stage.options, initState);

  else if (isOptionsOfStage<SelectStageOptions>(stage, AggrStageTypes.SELECT))
    return new SelectStage(stage.options, initState);

  else if (isOptionsOfStage<SetWindowFieldsStageOptions>(stage, AggrStageTypes.SET_WINDOW_FIELDS))
    return new SetWindowFieldsStage(stage.options, initState);

  else if (isOptionsOfStage<SetStageOptions>(stage, AggrStageTypes.SET))
    return new SetStage(stage.options, initState);

  else if (isOptionsOfStage<SkipStageOptions>(stage, AggrStageTypes.SKIP))
    return new SkipStage(stage.options, initState);

  else if (isOptionsOfStage<SortStageOptions>(stage, AggrStageTypes.SORT))
    return new SortStage(stage.options, initState);

    else if (isOptionsOfStage<UnionStageOptions>(stage, AggrStageTypes.UNION))
      return new UnionStage(stage.options, initState, getState ? getState(stage.options.dataStore) : []);

  else if (isOptionsOfStage<UnsetStageOptions>(stage, AggrStageTypes.UNSET))
    return new UnsetStage(stage.options, initState);

  else if (isOptionsOfStage<UnwindStageOptions>(stage, AggrStageTypes.UNWIND))
    return new UnwindStage(stage.options, initState);

  return null;
}

export function aggrPipelineFactory(
  stages: IAggrPiplineStage[],
  initState: TypedEntity[],
  getState?: (dataStore: string) => TypedEntity[]
) {
  const pipeline = new AggrPipeline();
  let currState = initState;

  for (const stage of stages) {

    const instance = aggrStageFactory(stage, currState, getState);

    if (instance) {
      pipeline.add(instance);
      currState = instance.outputType();
    }
  }

  return pipeline
}

export function isOptionsOfStage<T>(options: IAggrPiplineStage, type: AggrStageTypes): options is IAggrPiplineStage<T> {
  return options.type == type;
}