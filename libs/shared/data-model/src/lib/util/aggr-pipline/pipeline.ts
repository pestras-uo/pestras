import { TypedEntity } from "../data-types";
import { objUtil } from "@pestras/shared/util";
import { AggrPiplineStage, AggrStageTypes } from "./stages";

export class AggrPipeline {
  private _sealed = false;

  private _stages: AggrPiplineStage[] = [];


  constructor(stages: AggrPiplineStage[] = []) {

    for (const stage of stages) {
      this.add(stage);
    }
  }

  get sealed() {
    return this._sealed;
  }

  get stages() {
    return this._stages as Readonly<AggrPiplineStage[]>;
  }

  outputType(stageIndex?: number): TypedEntity[] {

    stageIndex = stageIndex ?? this._stages.length - 1;

    return this._stages[stageIndex]?.outputType() || [];
  }

  add(stage: AggrPiplineStage) {
    if (this._sealed)
      return;

    this._stages.push(objUtil.freezeObj(stage));

    if (stage.type === AggrStageTypes.OUT || stage.type === AggrStageTypes.MERGE)
      this._sealed = true;
  }

  pop() {
    if (this._sealed)
      this._sealed = false;

    if (this._stages.length > 0)
      return this._stages.pop();

    return null;
  }

  get(index = this._stages.length - 1) {
    return this._stages[index];
  }

  clear() {
    this._stages = [];
  }

  compile() {
    return this._stages.reduce((all, curr) => all.concat(curr.compile()), []);
  }
}