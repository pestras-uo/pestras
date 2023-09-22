import { Workflow, WorkflowAction, WorkflowStepOptions } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { Serial } from "@pestras/shared/util";

export type CreateWorkflowInput = Omit<Workflow, 'serial'>;

export class WorkflowModel extends Model<Workflow> {

  getBySerial(serial: string) {
    return this.col.findOne({ serial });
  }

  getByBlueprint(bp: string) {
    return this.col.find({ blueprint: bp }).toArray();
  }

  async create(input: CreateWorkflowInput) {
    const wf: Workflow = {
      serial: Serial.gen("WKF"),
      blueprint: input.blueprint,
      name: input.name,
      cancelable: input.cancelable,
      default_action: input.default_action,
      max_review_days: input.max_review_days,
      steps: input.steps.map(s => ({ serial: Serial.gen("WFS"), ...s }))
    };

    await this.col.insertOne(wf);

    return wf;
  }

  async updateName(serial: string, name: string) {
    await this.col.updateOne({ serial }, { $set: { name } });

    return true;
  }

  async updateMaxReviewDays(serial: string, days: number) {
    await this.col.updateOne({ serial }, { $set: { max_review_days: days } });

    return true;
  }

  async updateDefaultAction(serial: string, action: Exclude<WorkflowAction, WorkflowAction.REVIEW>) {
    await this.col.updateOne({ serial }, { $set: { default_action: action } });

    return true;
  }

  async updateCancelable(serial: string, cancelable: boolean) {
    await this.col.updateOne({ serial }, { $set: { cancelable } });

    return true;
  }

  async updateSteps(serial: string, parties: WorkflowStepOptions[]) {
    await this.col.updateOne({ serial }, { $set: { steps: parties } });

    return true;
  }
}