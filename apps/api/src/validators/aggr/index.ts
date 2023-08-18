import { Validall } from '@pestras/validall';
import { Validators } from '..';

export * from './operations';
export * from './stages';

new Validall(Validators.AGGR_PIPLINE, {
  $default: [],
  $each: {
    $or: [
      { $ref: Validators.BUCKET_STAGE },
      { $ref: Validators.FILL_STAGE },
      { $ref: Validators.GROUP_STAGE },
      { $ref: Validators.JOIN_STAGE },
      { $ref: Validators.LIMIT_STAGE },
      { $ref: Validators.MATCH_STAGE },
      { $ref: Validators.REPLACE_WITH_STAGE },
      { $ref: Validators.SAMPLE_STAGE },
      { $ref: Validators.SELECT_STAGE },
      { $ref: Validators.SET_STAGE },
      { $ref: Validators.SET_WIN_FIELD_STAGE },
      { $ref: Validators.SKIP_STAGE },
      { $ref: Validators.SORT_STAGE },
      { $ref: Validators.UNION_STAGE },
      { $ref: Validators.UNSET_STAGE },
      { $ref: Validators.UNWIND_STAGE }
    ]
  }
})