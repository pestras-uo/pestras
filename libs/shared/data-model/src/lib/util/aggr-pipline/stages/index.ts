/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedEntity } from "../../data-types";
import { objUtil } from "@pestras/shared/util";

export enum AggrStageTypes {
  BUCKET = 'bucket',
  CUSTOM = 'custom',
  // FACET = 'facet',
  FILL = 'fill',
  GROUP = 'group',
  JOIN = 'join',
  LIMIT = 'limit',
  // LOOKUP = 'look_up',
  MATCH = 'match',
  MERGE = 'merge',
  OUT = 'out',
  // REPLACE_WITH = 'replace_with',
  SELECT = 'select',
  SAMPLE = 'sample',
  SET = 'set',
  SET_WINDOW_FIELDS = 'setWindowFields',
  SKIP = 'skip',
  SORT = 'sort',
  UNION = 'union',
  UNSET = 'unset',
  UNWIND = 'unwind'
}

export interface IAggrPiplineStage<T = any> {
  type: AggrStageTypes;
  options: T;
}

export abstract class AggrPiplineStage<T = any> {
  private _options!: T;

  constructor(
    public readonly type: AggrStageTypes,
    public readonly inputState: TypedEntity[] = []
  ) {}

  static StageOfType<T extends AggrPiplineStage>(stage: AggrPiplineStage, type: AggrStageTypes): stage is T {
    return stage.type === type;
  }

  get options() {
    return this._options;
  }

  set options(value: T) {
    this._options = objUtil.cloneObject(objUtil.freezeObj(value));
  }

  outputType(): TypedEntity[] {
    return this.inputState;
  }
  
  abstract compile(): any;
}