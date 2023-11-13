import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface SettingsForm {
  interface_field: FormControl<string>;
  static: FormControl<boolean>;
  workflow: FormGroup<SettingsWorkflowFormModel>;
  history: FormControl<boolean>;
  max_attachments_count: FormControl<number>;
  card_view?: FormGroup<SettingsFormCardView>;
  tree_view?: FormArray<FormGroup<SettingsFormTreeView>>;
}

export interface SettingsWorkflowFormModel {
  create: FormControl<string | boolean>;
  update: FormControl<string | boolean>;
  delete: FormControl<string | boolean>;
}

export interface SettingsFormCardView {
  title: FormControl<string>;
  image: FormControl<string | null>;
  details: FormControl<string[]>;
}

export interface SettingsFormTreeView {
  field: FormControl<string>;
  display_field: FormControl<string | null>;
}