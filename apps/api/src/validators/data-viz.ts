/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validall } from "@pestras/validall";
import { Validators } from ".";
import { DataVizTypes, Stats, dataVizFilterOperators } from "@pestras/shared/data-model";

// Bar
// -----------------------------------------------------------------------------
const BAR = 'barDataViz';

new Validall(BAR, {
  type: { $equals: DataVizTypes.BAR },
  options: {
    category_field: { $type: 'string' },
    value_fields: { $is: 'notEmpty', $each: { $type: 'string' } },
    horizontal: { $cast: 'boolean', $default: false }
  }
});




// Box Plot
// -----------------------------------------------------------------------------
const BOXPLOT = 'boxplotDataViz';

new Validall(BOXPLOT, {
  type: { $equals: DataVizTypes.BOXPLOT },
  options: {
    value_fields: { $is: 'notEmpty', $each: { $type: 'string' } }
  }
});



// hierarchical
// -----------------------------------------------------------------------------
const HIERARCHICAL = 'hierarchicalDataViz';

new Validall(HIERARCHICAL, {
  type: { $equals: DataVizTypes.HIERARCHICAL },
  options: {
    name_field: { $type: 'string', $message: 'invalidHierarchicalSeriesNameField' },
    size_field: { $type: 'string', $message: 'invalidHierarchicalSeriesSizeField' },
    color_range: { $default: [], $each: { $type: 'string', $message: 'invalidHierarchicalColorRangeItem' } }
  }
});




// Line
// -----------------------------------------------------------------------------
const LINE = 'lineDataViz';

new Validall(LINE, {
  type: { $equals: DataVizTypes.LINE },
  x: { $type: 'string' },
  series: {
    lines: {
      $is: 'notEmpty',
      $each: {
        serie_name: { $nullable: true, $type: 'string' },
        y: { $type: 'string' },
        mark_lines: { $nullable: true, $each: { $enum: ['average', 'min', 'max'] } },
        mark_points: { $nullable: true, $each: { $enum: ['average', 'min', 'max'] } }
      }
    },
    area: { $cast: 'boolean', $default: false }
  }
});



// map
// -----------------------------------------------------------------------------
const MAP = 'mapDataViz';

new Validall(MAP, {
  type: { $equals: DataVizTypes.MAP },
  options: {
    use_map: {
      $nullable: true,
      $props: {
        region: { $type: 'string' },
        only_children: { $cast: 'boolean' }
      }
    },
    regions: {
      $nullable: true,
      $props: {
        region_field: { $type: 'string' },
        value_field: { $type: 'string' },
        color_range: { $each: { $type: 'string' } }
      }
    },
    scatter: {
      $nullable: true,
      $props: {
        value_field: { $type: 'string' },
        loc_field: { $type: 'string' },
        google_map: { $cast: 'boolean', $default: false },
        size_field: { $type: 'string', $nullable: true },
        effect_start_value: { $nullable: true, $type: 'number' },
        tooltip: {
          image: { $type: 'string', $nullable: true },
          heading: { $type: 'string', $nullable: true },
          body: { $default: [], $each: { $type: 'string' } },
        }
      }
    },
    pie: {
      $nullable: true,
      $props: {
        category_field: { $type: 'string' },
        value_field: { $type: 'string' },
        loc_field: { $type: 'string' },
        doughnut: { $cast: 'boolean', $default: false }
      }
    }
  }
});



// Pie
// -----------------------------------------------------------------------------
const PIE = 'pieDataViz';

new Validall(PIE, {
  type: { $equals: DataVizTypes.PIE },
  options: {
    category_field: { $type: 'string' },
    value_field: { $type: 'string' },
    doughnut: { $cast: 'boolean', $default: false }
  }
});



// Polar
// -----------------------------------------------------------------------------
const POLAR = 'polarDataViz';

new Validall(POLAR, {
  type: { $equals: DataVizTypes.POLAR },
  options: {
    category_field: { $type: 'string' },
    value_field: { $type: 'string' },
    indicator: { $cast: 'boolean', $default: false },
    reverse_indicator: { $cast: 'boolean', $default: false }
  }
});



// Radar
// -----------------------------------------------------------------------------
const RADAR = 'radarDataViz';

new Validall(RADAR, {
  type: { $equals: DataVizTypes.RADAR },
  options: {
    category_field: { $type: 'string' },
    value_fields: { $is: 'notEmpty', $each: { $type: 'string' } }
  }
});



// Scatter
// -----------------------------------------------------------------------------
const SCATTER = 'scatterDataViz';

new Validall(SCATTER, {
  type: { $equals: DataVizTypes.SCATTER },
  options: {
    series: {
      $is: 'notEmpty',
      $each: {
        serie_name: { $nullable: true, $type: 'string' },
        x: { $type: 'string' },
        y: { $is: 'notEmpty', $each: { $type: 'string' } },
        size_field: {
          $nullable: true,
          $props: {
            field: { $type: 'string' },
            min: { $nullable: true, $type: 'number' },
            max: { $nullable: true, $type: 'number' }
          }
        },
      }
    },
    regression: {
      $nullable: true,
      $props: {
        type: { $enum: ['linear', 'logarithmic', 'exponential', 'polynomial'] },
        order: { $nullable: true, $type: 'number' }
      }
    },
    cluster: { $nullable: true, $type: 'number' }
  }
});



// table
// -----------------------------------------------------------------------------
const TABLE = 'tableDataViz';

new Validall(TABLE, {
  type: { $equals: DataVizTypes.TABLE },
  options: {
    pagination: { $type: 'number', $nullable: true },
    indicator: {
      $nullable: true,
      $props: {
        field: { $type: 'string' },
        levels: {
          orange: { $type: 'number' },
          red: { $type: 'number' },
          blink: { $nullable: true, $type: 'number' }
        }
      }
    }
  }
});



// timeline
// -----------------------------------------------------------------------------
const TIMELINE = 'timelineDataViz';

new Validall(TIMELINE, {
  type: { $equals: DataVizTypes.TIMELINE },
  options: {
    category_field: { $type: 'string' },
    start_field: { $type: 'string' },
    end_field: { $type: 'string' },
    indicator: { $nullable: true, $type: 'string' }
  }
});



// Data Viz
// -----------------------------------------------------------------------------
new Validall(Validators.DATA_VIZ, {
  $props: {
    data_store: { $type: 'string', $message: 'invalidDataStoreId' },
    aggregate: {
      $nullable: true,
      $each: {
        $or: [{
          // filter
          type: { $equals: 'filter' },
          any: { $cast: 'boolean' },
          filters: {
            $each: {
              field: { $type: 'string' },
              operator: { $enum: dataVizFilterOperators as any }
            }
          }
        }, {
          type: { $equals: 'group' },
          count_name: { $type: 'string' },
          count_display_name: { $type: 'string', $nullable: true },
          by: {
            $is: 'notEmpty',
            $each: {
              name: { $type: 'string' },
              logical: { $cast: 'boolean' },
              logical_name: { $type: 'string', $nullable: true },
              logical_display_name: { $type: 'string', $nullable: true },
              true_value: { $nullable: true },
              false_value: { $nullable: true }
            }
          },
          calc: {
            $is: 'notEmpty',
            $each: {
              name: { $type: 'string' },
              method: { $enum: Stats.descriptiveStatsProps as any },
              new_name: { $type: 'string' },
              display_name: { $type: 'string', $nullable: true }
            }
          }
        }, {
          type: { $equals: 'limit' },
          count: { $type: 'number', $gt: 0 },
          end: { $cast: 'boolean' }
        }, {
          type: { $equals: 'sort' },
          fields: {
            $is: 'notEmpty',
            $each: {
              name: { $type: 'string' },
              desc: { $cast: 'boolean' }
            }
          }
        }, {
          type: { $equals: 'transpose' },
          name: { $type: 'string' },
          logical: { $cast: 'boolean' },
          target: { $type: 'string' },
          method: { $enum: Stats.descriptiveStatsProps as any },
          true_value: { $nullable: true },
          false_value: { $nullable: true }
        }]
      }
    }
  },
  $or: [
    { $ref: BAR },
    { $ref: BOXPLOT },
    { $ref: HIERARCHICAL },
    { $ref: LINE },
    { $ref: MAP },
    { $ref: PIE },
    { $ref: POLAR },
    { $ref: RADAR },
    { $ref: SCATTER },
    { $ref: TABLE },
    { $ref: TIMELINE }
  ]
});