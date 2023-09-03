import { FormControl } from "@angular/forms";

export interface AddTopicFormModel {
  blueprint: FormControl<string>;
  parent: FormControl<string | null>;
  name: FormControl<string>;
}