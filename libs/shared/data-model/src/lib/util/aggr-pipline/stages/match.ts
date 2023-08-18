/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPiplineStage, AggrStageTypes } from ".";
import { TypedEntity } from "../../data-types";
import { ModifiersOperation, ValueModifier } from "../operations/modifiers";

// Filter Operation for better UI/UX
// --------------------------------------------------------------------------
export const filterCompareOperators = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex'] as const;
export type FilterCompareOperator = typeof filterCompareOperators[number];

export interface FilterOptions {
  group: string;
  field: string; // field name
  operator: FilterCompareOperator;
  field_modifiers: ValueModifier[];
  value_from_field: boolean;
  value: any;
  value_modifiers: ValueModifier[];
}

export type MatchStageOptions = {
  filters: FilterOptions[];
}

export class MatchStage extends AggrPiplineStage<MatchStageOptions> {

  constructor(options: MatchStageOptions, inputState: TypedEntity[] = []) {
    super(AggrStageTypes.MATCH, inputState);

    this.options = options;
  }

  override outputType(): TypedEntity[] {
    return this.inputState;
  }

  compile() {

    return {
      $match: { $expr: createQuery(this.options.filters) }
    }
  }
}


// helpers
// ---------------------------------------------------------------------------------------------------
function getLevel(group: string) {
  return group.split('-').length;
}

function aggrOptions(options: FilterOptions) {
  const fieldPart = new ModifiersOperation({ value: '$' + options.field, modifiers: options.field_modifiers }).compile();

  if ((options.operator === '$eq' || options.operator === '$ne') && options.value === 'null') {
    return options.operator === '$eq'
      ? { "$in": [fieldPart, ['', 'null', null]] }
      : { "$not": { "$in": [fieldPart, ['', 'null', null]] } }
  }

  let valuePart = new ModifiersOperation({ value: (options.value_from_field ? '$' : '') + options.value, modifiers: options.value_modifiers }).compile();

  if (options.operator !== '$in' && options.operator !== '$nin')
    valuePart = valuePart[0];


  return { [options.operator]: [fieldPart, valuePart] };
}

function createQuery(filters: FilterOptions[]) {
  filters.sort((a, b) => a.group.split('-').length - b.group.split('-').length);

  const map: Record<string, any> = {};

  for (const f of filters) {
    if (!map[f.group])
      map[f.group] = { $and: [] };

    map[f.group].$and.push(aggrOptions(f));
  }

  const keys = Object.keys(map);

  for (const group of keys) {
    const parent = map[group];
    const level = getLevel(group);
    const childGroups = keys.filter(k => k.startsWith(group) && (getLevel(k) - level === 1));

    if (childGroups.length === 1)
      parent.$and.push(map[childGroups[0]]);

    else if (childGroups.length > 1) {
      const or: any = { $or: [] };

      for (const cg of childGroups)
        or.$or.push(map[cg]);

      parent.$and.push(or)
    }
  }

  const output = {
    $or: keys
      .filter(k => getLevel(k) === 1)
      .map(key => map[key])
  };

  function clean(parent: any) {
    for (let i = 0; i < parent.length; i++) {
      const el = parent[i];

      if (el.$and) {
        if (el.$and.length === 1) {
          parent[i] = el.$and[0];
          continue;
        }

        clean(el.$and);
      }

      if (el.$or) {
        if (el.$or.length === 1) {
          parent[i] = el.$or[0];
          continue;
        }

        clean(el.$or);
      }

    }
  }

  clean(output.$or);

  return output;
}