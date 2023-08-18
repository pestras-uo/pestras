/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { PuiTableColumnType, PuiTableConfig } from "./types";
import { objUtil } from '@pestras/shared/util';

export function filter(list: any[], search: string, config: PuiTableConfig) {
  const searchColumns = config.columns.filter(c => ![PuiTableColumnType.TEMPLATE, PuiTableColumnType.ACTION].includes(c.type || PuiTableColumnType.TEXT));

  if (!search || searchColumns.length === 0)
    return list;

  return list.filter((d: any) => {
    for (const column of searchColumns) {
      const val = objUtil.getValueFromPath(column.key, d);

      // List Type
      if (column.type === PuiTableColumnType.LIST) {

        // List of Indexes
        for (const item of val)
          if (column.srcArray) {
            const text = column.srcArray[item];
            if (text && text.indexOf(search) > -1)
              return true;
          } else {
            if (typeof item === 'string' && item.indexOf(search) > -1)
              return true;
          }

        // Date Type
      } else if (column.type === PuiTableColumnType.DATE) {
        let mode: string;

        if (search.charAt(0) === '<' || search.charAt(0) === '>' || search.charAt(0) === '=')
          mode = search.charAt(0);
        else
          continue;

        const date = new Date(search.slice(1).trim());
        const valDate = new Date(val);

        if (date.toString() === 'Invalid Date' || valDate.toString() === 'Invalid Date')
          continue;

        if ((mode === '>' && date <= val) || (mode === '<' && date >= val))
          return true;
        else if (
          date.getFullYear() === valDate.getFullYear() &&
          date.getMonth() === valDate.getMonth() &&
          date.getDate() === valDate.getDate()
        )
          return true;

      } else if (column.type === PuiTableColumnType.NUMBER) {
        let mode = "";

        if (search.charAt(0) === '<' || search.charAt(0) === '>')
          mode = search.charAt(0);

        const num = mode ? +search.slice(1).trim() : +search;

        if ((!mode && num === val) || (mode === '>' && num < val) || (mode === '<' && num > val))
          return true;

      } else if (column.type === PuiTableColumnType.ACTION) {
        continue;
      } else if (column.type === PuiTableColumnType.BOOL) {
        if ((!!val && search === '=1') || (!val && search === '=0'))
          return true;

      } else {
        if (typeof val === "string" && val.indexOf(search) > -1)
          return true;
        else if (column.srcArray) {
          const text = column.srcArray[val];
          if (text && text.indexOf(search) > -1)
            return true;
        }
      }
    }

    return false;
  });
}