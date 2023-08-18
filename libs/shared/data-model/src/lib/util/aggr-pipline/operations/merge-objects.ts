import { AggrOperation, AggrOperationType } from ".";
import { TypedEntity, createTypedEntity } from "../../data-types";

export type MergeObjectsOperationOptions = {
  fields: string[];
};

export class MergeObjectsOperation extends AggrOperation<MergeObjectsOperationOptions> {

  constructor(options: MergeObjectsOperationOptions) {
    super(AggrOperationType.MERGE_OBJECTS);

    this.options = options;
  }

  static override OutputType(): TypedEntity {
    return createTypedEntity({ type: 'unknown' });
  }

  compile() {
    return {
      $mergeObjects: this.options.fields
    }
  }
}