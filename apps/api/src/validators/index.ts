export enum Validators {
  // common
  REF = 'RefSchema',
  SERIAL = 'serialSchema',
  NAME = 'nameSchema',
  SUMMARY = 'summarySchema',
  TITLE = 'titleSchema',
  GEOLOCATION = 'locationSchema',

  // active-directory
  USERNAME = 'usernameSchema',
  PASSWORD = 'passwordSchema',
  FULLNAME = 'fullnameSchema',
  ROLE = 'roleSchema',
  FULL_ROLES = 'fillRolesSchema',
  ROLES = 'rolesSchema',

  // date
  DATE_UNIT = 'dateUnitSchema',
  DURATION = 'durationSchema',
  
  // filter options & constraints
  VALUE_MODIFIERS = 'valueModifiers',
  CONSTRAINT_OPTIONS = 'ConstraintOptionsSchema',

  ANALYSIS = 'analysis',
  DATA_VIZ = 'dataViz',

  // aggr operations
  CONVERT_OPERATION = 'convertOperation',
  DATA_ADD_OPERATION = 'dateAddOperation',
  DATE_DIFF_OPERATION = 'dateDiffOperation',
  MATH_EXPR_OPERATION = 'mathExpreOperation',
  MERGE_OBJECTS_OPERATION = 'mergeObjects',
  MINMAX_OPERATION = 'minmaxOperation',
  MODIFIERS_OPERATION = 'modifiersOperation',
  ROUND_OPERATION = 'roundOperation',

  // aggr stages
  BUCKET_STAGE = 'bucketsStage',
  FILL_STAGE = 'fillStage',
  GROUP_STAGE = 'groupStage',
  JOIN_STAGE = 'joinStage',
  LIMIT_STAGE = 'limitStage',
  FILTER_OPTIONS = 'filterOptions',
  MATCH_STAGE = 'matchStage',
  MERGE_STAGE = 'mergeStage',
  OUT_STAGE = 'outStage',
  REPLACE_WITH_STAGE = 'replaceWithStage',
  SAMPLE_STAGE = 'sampleStage',
  SELECT_STAGE = 'selectStage',
  SET_WIN_FIELD_STAGE = 'setWinFieldStage',
  SET_STAGE_OPTION = 'setStageOptions',
  SET_STAGE = 'setStage',
  SKIP_STAGE = 'skipStage',
  SORT_STAGE = 'sortStage',
  UNION_STAGE = 'unionStage',
  UNSET_STAGE = 'unsetStage',
  UNWIND_STAGE = 'unwindStage',
  AGGR_PIPLINE = 'aggrPipline'
}