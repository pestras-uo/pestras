import { DataStore, QueryOptionUse } from "@pestras/shared/data-model";
import { dateUtil } from "@pestras/shared/util";
import { RequestPayload } from "./types";

export function generateRequestPayload(dataStore: DataStore, skip?: number, limit?: number) {

  const settings = dataStore.web_service;

  const bodyParams: Record<string, unknown> = {};
  const searchParams: Record<string, string> = {};
  const pathParams: Record<string, string> = {};

  if (settings.pagination && skip !== undefined) {
    searchParams[settings.pagination.skip] = "" + skip;
    searchParams[settings.pagination.limit] = "" + (limit ?? 20);
  }

  settings.payload
    .filter(param =>
      param.use === QueryOptionUse.ALWAYES ||
      (settings.initialized && param.use === QueryOptionUse.DEFAULT) ||
      (!settings.initialized && param.use === QueryOptionUse.INIT_ONLY)
    )
    .forEach(param => {

      let value = param.value === '$$NOW' ? new Date() : param.value;

      if (param.add_to_date)
        value = dateUtil.dateAdd(param.add_to_date, value);

      const parsed = param.date_format
        ? dateUtil.formatDate(value as Date, param.date_format)
        : value;

      if (param.dest === "body")
        bodyParams[param.key] = parsed;
      else if (param.dest === 'search')
        searchParams[param.key] = parsed as string;
      else
        pathParams[param.key] = parsed as string;
    });

  return {
    params: pathParams,
    search: searchParams,
    body: bodyParams
  } as RequestPayload;
}