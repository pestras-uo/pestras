/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, TypeKind } from "@pestras/shared/data-model";

export interface AdvancedSearchModelItem {
  field: Field;
  values: any[];
  inverse: boolean;
}

export function filterToQuery(filters: AdvancedSearchModelItem[] | null) {
  const query = !filters
    ? null
    : filters
      .map(entry => fieldQueryBuilder[entry.field.type](entry.field, entry.values, entry.inverse));

  return query ? { $and: query } : null;
}

const fieldQueryBuilder: { [key: string]: (field: Field, values: any[], inverse: boolean) => any } = {
  int(field: Field, values: any[], _: boolean) {
    if (values[0] !== null && values[1] !== null)
      return +values[0] < +values[1]
        ? { $and: [{ [field.name]: { $gte: +values[0] } }, { [field.name]: { $lte: +values[1] } }] }
        : { $or: [{ [field.name]: { $gte: +values[0] } }, { [field.name]: { $lte: +values[1] } }] };

    return values[0] !== null
      ? { [field.name]: { $gte: +values[0] } }
      : { [field.name]: { $lte: +values[1] } }
  },

  double(field: Field, values: any[], _: boolean) {
    return this['int'](field, values, _);
  },
  date(field: Field, values: any[], _: boolean) {
    if (values[0] !== null && values[1] !== null)
      return +values[0] < +values[1]
        ? { $and: [{ [field.name]: { $gte: values[0] } }, { [field.name]: { $lte: values[1] } }] }
        : { $or: [{ [field.name]: { $gte: values[0] } }, { [field.name]: { $lte: values[1] } }] };

    return values[0] !== null
      ? { [field.name]: { $gte: values[0] } }
      : { [field.name]: { $lte: values[1] } }
  },
  datetime(field: Field, values: any[], _: boolean) {
    return this['date'](field, values, _);
  },
  string(field: Field, values: any[], inverse: boolean) {
    return !inverse
      ? { [field.name]: { $regex: values[0] } }
      : { [field.name]: { $not: { $regex: values[0] } } };
  },
  boolean(field: Field, values: any[], inverse: boolean) {
    return !inverse
      ? { [field.name]: { $eq: !!values[0] } }
      : { [field.name]: { $ne: !!values[0] } };
  },
  category(field: Field, values: any[], inverse: boolean) {
    if (field.kind === TypeKind.RANGE)
      return !inverse
        ? { $or: values[0].map((v: [number, number]) => ({ [field.name]: { $gte: v[0], $lte: v[1] } })) }
        : { $and: values[0].map((v: [number, number]) => ({ $or: [{ [field.name]: { $lt: v[0] } }, { [field.name]: { $gt: v[1] } }] })) }

    return !inverse
      ? { [field.name]: { $in: values[0] } }
      : { [field.name]: { $nin: values[0] } };
  },
  serial(field: Field, values: any[], inverse: boolean) {
    return this['category'](field, values, inverse);
  },
  region(field: Field, values: any[], inverse: boolean) {
    return this['category'](field, values, inverse);
  }
};