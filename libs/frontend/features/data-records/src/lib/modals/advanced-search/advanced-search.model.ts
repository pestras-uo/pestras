/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from "@pestras/shared/data-model";

export interface AdvancedSearchModelItem {
  field: Field;
  values: any[];
  inverse: boolean;
}

export function filterToQuery(filters: AdvancedSearchModelItem[] | null) {
  const query = !filters
    ? null
    : filters
      .map(entry => fieldQueryBuilder[entry.field.type](entry.field.name, entry.values, entry.inverse));

  return query ? { $and: query } : null;
}

const fieldQueryBuilder: { [key: string]: (field: string, values: any[], inverse: boolean) => any } = {
  int(field: string, values: any[], _: boolean) {
    if (values[0] !== null && values[1] !== null)
      return +values[0] < +values[1]
        ? { $and: [{ [field]: { $gte: +values[0] } }, { [field]: { $lte: +values[1] } }] }
        : { $or: [{ [field]: { $gte: +values[0] } }, { [field]: { $lte: +values[1] } }] };

    return values[0] !== null
      ? { [field]: { $gte: +values[0] } }
      : { [field]: { $lte: +values[1] } }
  },

  double(field: string, values: any[], _: boolean) {
    return this['int'](field, values, _);
  },
  date(field: string, values: any[], _: boolean) {
    if (values[0] !== null && values[1] !== null)
      return +values[0] < +values[1]
        ? { $and: [{ [field]: { $gte: values[0] } }, { [field]: { $lte: values[1] } }] }
        : { $or: [{ [field]: { $gte: values[0] } }, { [field]: { $lte: values[1] } }] };

    return values[0] !== null
      ? { [field]: { $gte: values[0] } }
      : { [field]: { $lte: values[1] } }
  },
  datetime(field: string, values: any[], _: boolean) {
    return this['date'](field, values, _);
  },
  string(field: string, values: any[], inverse: boolean) {
    return !inverse
      ? { [field]: { $regex: values[0] } }
      : { [field]: { $not: { $regex: values[0] } } };
  },
  boolean(field: string, values: any[], inverse: boolean) {
    return !inverse
      ? { [field]: { $eq: !!values[0] } }
      : { [field]: { $ne: !!values[0] } };
  },
  category(field: string, values: any[], inverse: boolean) {
    return !inverse
      ? { [field]: { $in: values[0] } }
      : { [field]: { $nin: values[0] } };
  },
  serial(field: string, values: any[], inverse: boolean) {
    return this['category'](field, values, inverse);
  },
  region(field: string, values: any[], inverse: boolean) {
    return this['category'](field, values, inverse);
  }
};