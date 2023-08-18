import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiCheckInput, PuiIcon, PuiSelectInput, PuiSwitchInput, PuiUtilPipesModule } from '@pestras/frontend/ui';

// operations
import { ConvertOperationForm } from './operations/convert-operation/convert-operation.form';
import { DateAddOperationForm } from './operations/date-add-operation/date-add-operation.form';
import { DateDiffOperationForm } from './operations/date-diff-operation/date-diff-operation.form';
import { MathExprOperationForm } from './operations/math-expr-operation/math-expr-operation.form';
import { MinmaxOperationForm } from './operations/minmax-operation/minmax-operation.form';
import { ModifiersOperationForm } from './operations/modifiers-operation/modifiers-operation.form';
import { RoundOperationForm } from './operations/round-operation/round-operation.form';

// stages
import { BucketStageForm } from './stages/bucket-stage/bucket-stage.form';
import { FillStageForm } from './stages/fill-stage/fill-stage.form';
import { GroupStageForm } from './stages/group-stage/group-stage.form';
import { LimitStageForm } from './stages/limit-stage/limit-stage.form';
import { MatchStageForm } from './stages/match-stage/match-stage.form';
import { SampleStageForm } from './stages/sample-stage/sample-stage.form';
import { SelectStageForm } from './stages/select-stage/select-stage.form';
import { SetStageForm } from './stages/set-stage/set-stage.form';
import { SingleSetStageForm } from './stages/single-set-stage/single-set-stage.form';
import { SkipStageForm } from './stages/skip-stage/skip-stage.form';
import { SortStageForm } from './stages/sort-stage/sort-stage.form';
import { UnsetStageForm } from './stages/unset-stage/unset-stage.form';
import { PipelineForm } from './pipeline/pipeline.form';
import { SetWindowFieldsStageForm } from './stages/set-window-fields-stage/set-window-fields-stage.form';
import { GetStagePipe } from './pipes/get-stage.pipe';
import { JoinStageForm } from './stages/join-stage/join-stage.form';
import { UnionStageForm } from './stages/union-stage/union-stage.form';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    // operations
    ConvertOperationForm,
    DateAddOperationForm,
    DateDiffOperationForm,
    MathExprOperationForm,
    MinmaxOperationForm,
    ModifiersOperationForm,
    RoundOperationForm,
    // stages
    BucketStageForm,
    FillStageForm,
    GroupStageForm,
    LimitStageForm,
    MatchStageForm,
    SampleStageForm,
    SelectStageForm,
    SetStageForm,
    SetWindowFieldsStageForm,
    SingleSetStageForm,
    SkipStageForm,
    SortStageForm,
    UnsetStageForm,
    PipelineForm,
    GetStagePipe,
    JoinStageForm,
    UnionStageForm
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // state
    StateModule,
    // Util
    ContraModule,
    // PUI
    PuiIcon,
    PuiSelectInput,
    PuiSwitchInput,
    PuiUtilPipesModule,
    PuiCheckInput,
    // Features
    DataStoresFeatureModule
  ],
  exports: [
    PipelineForm,
    MatchStageForm
  ]
})
export class AggregationFeatureModule { }
