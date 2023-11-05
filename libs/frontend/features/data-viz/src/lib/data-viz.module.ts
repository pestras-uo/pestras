import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import {
  PuiCheckInput,
  PuiGoogleMapModule,
  PuiIcon,
  PuiMultiSelectInput,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiTableModule,
  PuiUtilPipesModule,
} from '@pestras/frontend/ui';
import { HierarchicalForm } from './forms/hierarchical/hierarchical.form';
import { MapForm } from './forms/map/map.form';
import { RadarForm } from './forms/radar/radar.form';
import { TableForm } from './forms/table/table.form';
import { TimelineForm } from './forms/timeline/timeline.form';
import { BarChartView } from './views/bar-chart/bar-chart.view';
import { NgxEchartsModule } from 'ngx-echarts';
import { LineChartView } from './views/line-chart/line-chart.view';
import { HierarchicalChartView } from './views/hierarchical-chart/hierarchical-chart.view';
import { ScatterChartView } from './views/scatter-chart/scatter-chart.view';
import { RadarChartView } from './views/radar-chart/radar-chart.view';
import { TableViewView } from './views/table-view/table-view.view';
import { TimelineChartView } from './views/timeline-chart/timeline-chart.view';
import { MapChartView } from './views/map-chart/map-chart.view';
import { PieChartView } from './views/pie-chart/pie-chart.view';
import { BoxplotChartView } from './views/boxplot-chart/boxplot-chart.view';
import { PolarChartView } from './views/polar-chart/polar-chart.view';
import { MapRegionsChartView } from './views/map-chart/map-regions-chart/map-regions-chart.view';
import { MapPieChartView } from './views/map-chart/map-pie-chart/map-pie-chart.view';
import { MapScatterChartView } from './views/map-chart/map-scatter-chart/map-scatter-chart.view';
import { BarChartForm } from './forms/bar-chart/bar-chart.form';
import { PieChartForm } from './forms/pie-chart/pie-chart.form';
import { BoxplotChartForm } from './forms/boxplot-chart/boxplot-chart.form';
import { LineChartForm } from './forms/line-chart/line-chart.form';
import { PolarChartForm } from './forms/polar-chart/polar-chart.form';
import { ScatterChartForm } from './forms/scatter-chart/scatter-chart.form';
import { ChartForm } from './forms/chart/chart.form';
import { ChartView } from './views/chart/chart.view';
import { AggrForm } from './forms/aggr/aggr.form';
import { FilterForm } from './forms/aggr/filter/filter.form';
import { GroupForm } from './forms/aggr/group/group.form';
import { LimitForm } from './forms/aggr/limit/limit.form';
import { SortForm } from './forms/aggr/sort/sort.form';
import { TransposeForm } from './forms/aggr/transpose/transpose.form';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { RecordsFeatureModule } from '@pestras/frontend/features/data-records';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { EnvModule } from '@pestras/frontend/env';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';

@NgModule({
  declarations: [
    HierarchicalForm,
    MapForm,
    RadarForm,
    TableForm,
    TimelineForm,
    BarChartView,
    LineChartView,
    HierarchicalChartView,
    ScatterChartView,
    RadarChartView,
    TableViewView,
    TimelineChartView,
    MapChartView,
    PieChartView,
    BoxplotChartView,
    PolarChartView,
    MapRegionsChartView,
    MapPieChartView,
    MapScatterChartView,
    BarChartForm,
    PieChartForm,
    BoxplotChartForm,
    LineChartForm,
    PolarChartForm,
    ScatterChartForm,
    ChartForm,
    ChartView,
    AggrForm,
    FilterForm,
    GroupForm,
    LimitForm,
    SortForm,
    TransposeForm,
  ],

  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // Util
    EnvModule,
    ContraModule,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    PuiMultiSelectInput,
    PuiUtilPipesModule,
    PuiGoogleMapModule,
    PuiCheckInput,
    PuiTableModule,
    // Features
    DataStoresFeatureModule,
    NgxEchartsModule,
    RegionsFeatureModule,
    RecordsFeatureModule,
    CategoriesFeatureModule,
    // widgets
    NoDataPlaceholderWidget,
  ],
  exports: [
    BarChartView,
    LineChartView,
    HierarchicalChartView,
    ScatterChartView,
    RadarChartView,
    TableViewView,
    TimelineChartView,
    MapChartView,
    PieChartView,
    BoxplotChartView,
    PolarChartView,
    ChartForm,
    ChartView,
  ],
})
export class DataVizFeatureModule {}
