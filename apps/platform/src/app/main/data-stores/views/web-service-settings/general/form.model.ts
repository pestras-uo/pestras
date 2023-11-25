import { FormControl, FormGroup } from "@angular/forms";
import { Interval, WSAccept, WSContentType } from "@pestras/shared/data-model";

export interface WebServiceConfigModel {
  resource_uri: FormControl<string>;
  method: FormControl<'get' | 'post'>;
  make_init_request: FormControl<boolean>;
  replace_existing: FormControl<boolean>;
  content_type: FormControl<WSContentType>;
  accept: FormControl<WSAccept>;
  data_path: FormControl<string>;
  intervals: FormControl<Interval>;
  fetch_day: FormControl<number>;
  pagination: FormGroup<WebServicePaginationModel>;
}

export interface WebServicePaginationModel {
  skip: FormControl<string>;
  limit: FormControl<string>;
}