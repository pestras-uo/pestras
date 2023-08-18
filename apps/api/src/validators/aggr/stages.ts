/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validall } from "@pestras/validall";
import { Validators } from "..";
import { CumulateMethod, filterCompareOperators } from "@pestras/shared/data-model";

export const cumulateMethods: CumulateMethod[] = ['sum', 'min', 'max', 'count', 'avg'];

new Validall(Validators.BUCKET_STAGE, {
  type: { $equals: 'bucket' },
  options: {
    groupBy: {
      field: { $type: 'string', $message: 'invalidBucketsStageGroupByField' },
      modifiers: { $ref: Validators.VALUE_MODIFIERS }
    },
    cumulate: {
      $required: true,
      $is: 'notEmpty',
      $message: 'bucketsStageCumulateFieldsAreRequired',
      $each: {
        field: { $type: 'string', $message: 'invalidBucketsStageCumulateField' },
        method: { $enum: cumulateMethods, $message: 'invaidBucketsStageCumulateMethod' },
        expr: {
          $or: [
            { $type: 'number', $message: 'invalidBucketsStageCumuplateExpr' },
            { $type: 'string', $message: 'invalidBucketsStageCumuplateExpr' },
          ]
        }
      }
    }
  }
});

new Validall(Validators.FILL_STAGE, {
  type: { $equals: 'fill' },
  options: {
    output: {
      $required: true,
      $is: 'notEmpty',
      $message: 'fillStageOutputsAreRequired',
      $each: {
        field: { $type: 'string', $message: 'invalidFillStageOutputField' },
        value: { $type: 'string', $message: 'invalidFillStageOutputValue' },
        method: { $nullable: true, $enum: ['linear', 'locf'], $message: 'invalidFillStageOutputMethod' }

      }
    },
    sortBy: {
      field: { $type: 'string', $message: 'invalidFillStageSortByField' },
      order: { $enum: [-1 | 1], $default: 1, $message: 'invalidFillStageSortByOrder' }
    },
    partitionBy: {
      field: { $type: 'string', $message: 'invalidFillStagePartitionByField' },
      modifiers: { $ref: Validators.VALUE_MODIFIERS }
    }
  }
});

new Validall(Validators.GROUP_STAGE, {
  type: { $equals: 'group' },
  options: {
    by: {
      field: { $type: 'string', $message: 'invalidGroupStageGroupByField' },
      as: { $type: 'string', $message: 'invalidGroupStageByAsValue' },
      modifiers: { $ref: Validators.VALUE_MODIFIERS }
    },
    cumulate: {
      $is: 'notEmpty',
      $message: 'bucketsStageCumulateFieldsAreRequired',
      $each: {
        field: { $type: 'string', $message: 'invalidGroupStageCumulateField' },
        display_name: { $type: 'string', $message: 'invalidGroupStageCumulateDisplayName' },
        method: { $enum: cumulateMethods, $message: 'invaidGroupStageCumulateMethod' },
        expr: {
          $or: [
            { $type: 'number', $message: 'invalidGroupStageCumuplateExpr' },
            { $type: 'string', $message: 'invalidGroupStageCumuplateExpr' },
          ]
        }
      }
    }
  },
});

new Validall(Validators.JOIN_STAGE, {
  type: { $equals: 'join' },
  options: {
    dataStore: { $type: 'string', $message: 'InvalidJoinStageDataStore' },
    on: {
      $is: 'notEmpty',
      $message: 'joinStageOnOptionsAreRequired',
      $each: {
        localField: {
          name: { $type: 'string', $message: 'invalidJoinStageLocalFieldName' },
          modifiers: { $ref: Validators.VALUE_MODIFIERS },
        },
        foreignField: {
          name: { $type: 'string', $message: 'invalidJoinStageForeignFieldName' },
          modifiers: { $ref: Validators.VALUE_MODIFIERS },
        }
      }
    },
    fields: {
      $default: [],
      $each: {
        name: { $type: 'string', $message: 'invalidSelectStageFieldName' },
        as: { $nullable: true, $type: 'string', $is: 'notEmpty', $message: 'invalidSelectStageAsName' }
      }
    }
  }
});

new Validall(Validators.LIMIT_STAGE, {
  type: { $equals: 'limit' },
  options: {
    limit: { $type: 'number', $default: 10, $gt: 0, $message: 'invalidLimitStageLimitValue' }
  }
});

export const compareOperators = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex'];

new Validall(Validators.FILTER_OPTIONS, {
  filters: {
    $required: true,
    $is: 'notEmpty',
    $message: 'queryOptionsListAreRequired',
    $each: {
      group: { $default: 'A', $type: 'string', $is: 'notEmpty', $message: 'invalidQueryOperationGroup' },
      field: { $type: 'string', $message: 'queryOperationFieldIsRequired' },
      operator: { $required: true, $enum: filterCompareOperators as any, $message: 'invalidQueryOperationOperator' },
      field_modifiers: { $ref: Validators.VALUE_MODIFIERS },
      value_from_ield: { $cast: 'boolean' },
      value: { $message: 'queryOperationCompareToValueIsRequired' },
      value_modifiers: { $ref: Validators.VALUE_MODIFIERS }
    }
  }
});

new Validall(Validators.MATCH_STAGE, {
  type: { $equals: 'match' },
  options: { $ref: Validators.FILTER_OPTIONS }
});

new Validall(Validators.REPLACE_WITH_STAGE, {
  type: { $equals: 'replace_with' },
  options: {
    $ref: Validators.MERGE_OBJECTS_OPERATION
  }
});

new Validall(Validators.SAMPLE_STAGE, {
  type: { $equals: 'sample' },
  options: {
    size: { $type: 'number', $gt: 0, $message: 'invalidSampleStageSizeValue' }
  }
});

new Validall(Validators.SELECT_STAGE, {
  type: { $equals: 'select' },
  options: {
    fields: {
      $required: true,
      $is: 'notEmpty',
      $message: 'selectStageFieldsAreRequired',
      $each: {
        name: { $type: 'string', $message: 'invalidSelectStageFieldName' },
        as: { $nullable: true, $type: 'string', $is: 'notEmpty', $message: 'invalidSelectStageAsName' }
      }
    }
  }
});

new Validall(Validators.SET_WIN_FIELD_STAGE, {
  type: { $equals: 'setWindowFields' },
  options: {
    sortBy: {
      $required: true,
      $is: 'notEmpty',
      $message: 'setWinFieldStageSortByFieldsAreRequired',
      $each: {
        field: { $type: 'string', $message: 'invalidSetWinFieldStageSortByField' },
        order: { $enum: [-1, 1], $default: 1, $message: 'invalidSetWinFieldStageSortByOrder' }
      }
    },
    partitionBy: {
      field: { $type: 'string', $message: 'invalidSetWinFieldStagePartitionByField' },
      modifiers: { $ref: Validators.VALUE_MODIFIERS }
    },
    outputs: {
      $required: true,
      $is: 'notEmpty',
      $message: 'setWinFieldStageOutputsFieldsAreRequired',
      $each: {
        name: { $type: 'string', $message: 'invalidSetWinFieldStageOutputsFieldName' },
        display_name: { $type: 'string', $message: 'invalidSetWinFieldStageOutputsFieldDisplayName' },
        field: {
          name: { $type: 'string', $message: 'invalidSetWinFieldStageOutputsField' },
          modifiers: { $ref: Validators.VALUE_MODIFIERS }
        },
        method: { $enum: cumulateMethods, $message: 'invaidSetWinFieldStageOutputMethod' },
        documents: {
          start: {},
          end: {}
        }
      }
    }
  }
});

const setFieldOperations = ['convert', 'dateAdd', 'dateDiff', 'mathExpr', 'minmax', 'modifiers', 'round', 'switch'];

new Validall(Validators.SET_STAGE_OPTION, {
  field: { $type: 'string', $message: 'invalidSetStageFieldName' },
  display_name: { $type: 'string', $message: 'invalidSetStageFieldDisplayName' },
  operation: { $enum: setFieldOperations, $message: 'invalidSetStageOperation' },
  options: {
    $or: [
      { $ref: Validators.CONVERT_OPERATION },
      { $ref: Validators.DATA_ADD_OPERATION },
      { $ref: Validators.DATE_DIFF_OPERATION },
      { $ref: Validators.MATH_EXPR_OPERATION },
      { $ref: Validators.MINMAX_OPERATION },
      { $ref: Validators.MODIFIERS_OPERATION },
      { $ref: Validators.ROUND_OPERATION }
    ]
  }
});

new Validall(Validators.SET_STAGE, {
  type: { $equals: 'set' },
  options: {
    fields: {
      $is: 'notEmpty',
      $message: 'setStageOutputsFieldsAreRequired',
      $each: { $ref: Validators.SET_STAGE_OPTION }
    }
  }
});

new Validall(Validators.SKIP_STAGE, {
  type: { $equals: 'skip' },
  options: {
    skip: { $type: 'number', $default: 0, $gte: 0, $message: 'invalidSkipStageLimitValue' }
  }
});

new Validall(Validators.UNION_STAGE, {
  type: { $equals: 'union' },
  options: {
    dataStore: { $type: 'string', $message: 'invalidUnionStageDataStore' },
    mapFields: {
      $is: 'notEmpty',
      $each: {
        src: { $type: 'string' },
        dest: { $type: 'string' }
      }
    }
  }
});

new Validall(Validators.SORT_STAGE, {
  type: { $equals: 'sort' },
  options: {
    fields: {
      $is: 'notEmpty',
      $message: 'sortStageOutputsFieldsAreRequired',
      $each: {
        field: { $type: 'string', $message: 'invalidSortStageField' },
        order: { $enum: [-1 | 1], $default: 1, $message: 'invalidSortStageOrder' }
      }
    }
  }
});

new Validall(Validators.UNSET_STAGE, {
  type: { $equals: 'unset' },
  options: {
    fields: {
      $is: 'notEmpty',
      $message: 'sortStageOutputsFieldsAreRequired',
      $each: { $type: 'string', $message: 'invalidUnsetStageField' }
    }
  }
});

new Validall(Validators.UNWIND_STAGE, {
  type: { $equals: 'unwind' },
  options: {
    field: { $type: 'string', $message: 'invalidUnwindStageField' }
  }
});