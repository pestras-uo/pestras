import { DataStore, QueryOptionUse } from "@pestras/shared/data-model";
import { dateUtil } from "@pestras/shared/util";
import { RequestPayload } from "./types";

export function generateRequestPayload(dataStore: DataStore) {

    const bodyParams: Record<string, unknown> = {};
    const searchParams: Record<string, string> = {};
    const pathParams: Record<string, string> = {};
  
    dataStore.web_service.payload
      .filter(param =>
        param.use === QueryOptionUse.ALWAYES ||
        (dataStore.web_service.initialized && param.use === QueryOptionUse.DEFAULT) ||
        (!dataStore.web_service.initialized && param.use === QueryOptionUse.INIT_ONLY)
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