import { Validall } from "@pestras/validall";
import { Validators } from "../../validators";
import {
  DataStoreState,
  DataStoreType,
  TypeKind,
  referenceTypes,
  typesNames,
} from "@pestras/shared/data-model";

export enum DataStoreValidators {
  CREATE = "createDataStore",
  UPDATE = "updateDataStore",
  UPDATE_STATE = "updateTableState",
  SET_TABLE_SETTINGS = "dataStoretableSettigns",
  WEB_SERVICE = "dataStoreWebServiceSettings",
  WEB_SERVICE_AUTH = "dataStoreWebServiceSettingsAuth",
  WEB_SERVICE_HEADER = "dataStoreWebServiceSettingsHeader",
  WEB_SERVICE_OPTION = "addWsConfigQueryOption",
  ADD_WS_SELECTION = "addWsConfigSelection",
  AGGREGATION = "dataStoreAggregation",
  ADD_FIELD = "dataStoreField",
  UPDATE_FIELD = "updateField",
  UPDATE_FIELD_CONFIG = "updateFieldConfig",
  FIELD_CONSTRAINT = "fieldConstraint",
}

new Validall(DataStoreValidators.CREATE, {
  blueprint: { $ref: Validators.SERIAL },
  name: { $type: "string" },
  type: {
    $default: DataStoreType.TABLE,
    $enum: [
      DataStoreType.TABLE,
      DataStoreType.WEB_SERVICE,
      DataStoreType.AGGREGATIONAL,
    ],
    $message: "invalidType",
  },
});

new Validall(DataStoreValidators.UPDATE, {
  name: { $type: "string" },
});

new Validall(DataStoreValidators.UPDATE_STATE, {
  state: {
    $enum: [
      DataStoreState.ANALYSING,
      DataStoreState.ERROR,
      DataStoreState.FATAL,
      DataStoreState.FETCHING,
      DataStoreState.READY,
    ],
  },
});

new Validall(DataStoreValidators.SET_TABLE_SETTINGS, {
  interface_field: { $type: 'string' },
  static: { $cast: "boolean", $default: false },
  workflow: {
    create: { $or: [{ $type: 'boolean' }, { $type: 'string' }] },
    update: { $or: [{ $type: 'boolean' }, { $type: 'string' }] },
    delete: { $or: [{ $type: 'boolean' }, { $type: 'string' }] }
  },
  max_attachments_count: { $type: "number", $default: 0 },
  history: { $cast: "boolean", $default: false },
  card_view: {
    $nullable: true,
    $props: {
      title: { $type: "string" },
      image: { $type: "string", $nullable: true },
      details: { $each: { $type: "string" } },
    },
  },
  tree_view: {
    $nullable: true,
    $each: {
      field: { $type: 'string' },
      display_field: { $type: 'string', $nullable: true }
    }
  },
  sub_data_stores: {
    $each: {
      name: { $type: "string" },
      data_store: { $type: "string" },
      on: {
        local_field: { $type: "string" },
        foreign_field: { $type: "string" },
      },
    },
  },
});

new Validall(DataStoreValidators.WEB_SERVICE, {
  make_init_request: { $cast: "boolean" },
  replace_existing: { $cast: "boolean" },
  resource_uri: { $type: "string", $message: "invalidresourceUri" },
  method: {
    $default: "get",
    $in: ["get", "post"],
    $message: "invalidWebServiceMethod",
  },
  data_path: {
    $default: "",
    $type: "string",
    $message: "invalidWebServiceDataPath",
  },
  content_type: {
    $type: "string",
    $enum: ["application/json", "application/x-www-form-urlencoded"],
  },
  accept: {
    $type: "string",
    $enum: ["application/json", "text/xml", "text/csv"],
  },
  intervals: { $type: "number", $enum: [0, 1, 3, 6, 12] },
  fetch_day: {
    $default: 1,
    $type: "number",
    $message: "invalidFetchDayOption",
  },
});

new Validall(DataStoreValidators.WEB_SERVICE_AUTH, {
  username: { $type: "string" },
  password: { $type: "string" },
});

new Validall(DataStoreValidators.WEB_SERVICE_HEADER, {
  key: { $type: "string" },
  value: { $type: "string" },
});

new Validall(DataStoreValidators.WEB_SERVICE_OPTION, {
  key: { $type: "string", $message: "invalidQueryKey" },
  value: { $type: "string", $message: "invalidQueryValue" },
  date_format: { $default: "", $type: "string", $message: "invalidDateFormat" },
  add_to_date: { $default: [], $ref: Validators.DURATION },
  dest: { $in: ["body", "search"], $message: "invalidDestValue" },
  use: { $default: 0, $enum: [0, 1, 2], $message: "invalidUseValue" },
});

new Validall(DataStoreValidators.ADD_WS_SELECTION, {
  field: { $type: "string", $message: "cleansingSelectFieldIsRequired" },
  as: { $type: "string", $message: "cleansingSelectAsIsRequired" },
  type: {
    $type: "string",
    $enum: ["double", "long", "int", "decimel", "bool", "string", "date"],
    $message: "cleansingCastToIsRequired",
  },
  onError: { $required: true },
  onNull: { $required: true },
});

new Validall(DataStoreValidators.AGGREGATION, {
  from: { $type: "string" },
  pipeline: { $ref: Validators.AGGR_PIPLINE },
});

new Validall(DataStoreValidators.ADD_FIELD, {
  name: { $type: "string" },
  display_name: { $type: "string" },
  desc: {
    $nullable: true,
    $type: "string",
    $message: "invalidFieldDescription",
  },
  required: { $cast: "boolean", $default: true },
  initial: { $cast: "boolean", $default: false },
  default: { $nullable: true },
  unique: { $cast: "boolean", $default: false },
  constant: { $cast: "boolean", $default: false },
  automated: { $cast: "boolean", $default: false },
  group: { $type: "string" },
  type: { $enum: [...typesNames], $message: "invalidTypeName" },
  length: { $type: "number", $default: 1, $not: { $equals: 0 } },
  unit: { $type: "string", $nullable: true },
  mime: { $default: [], $each: { $type: "string" } },
  ref_type: { $enum: [...referenceTypes], $nullable: true },
  ref_to: { $type: "string", $nullable: true },
  kind: {
    $enum: [TypeKind.NONE, TypeKind.LINK, TypeKind.ORDINAL, TypeKind.RANGE, TypeKind.RICH_TEXT],
    $default: TypeKind.NONE,
  },
});

new Validall(DataStoreValidators.UPDATE_FIELD, {
  display_name: { $type: "string" },
  group: { $default: "", $type: "string" },
  desc: { $default: "", $type: "string", $message: "invalidFieldDescription" },
});

new Validall(DataStoreValidators.UPDATE_FIELD_CONFIG, {
  $ref: DataStoreValidators.ADD_FIELD,
});

new Validall(DataStoreValidators.FIELD_CONSTRAINT, {
  $ref: Validators.CONSTRAINT_OPTIONS,
});
