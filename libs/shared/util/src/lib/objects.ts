/* eslint-disable @typescript-eslint/no-explicit-any */
export const objUtil = {
  // equals objects
  // ---------------------------------------------------------------------------------------------------
  equals(left: any, right: any): boolean {
    if (!left || !right || typeof left !== 'object' || typeof right !== "object")
      return left === right;

    if (left instanceof Date || right instanceof Date)
      return left instanceof Date && right instanceof Date
        ? left.getTime() === right.getTime() : false;

    if (Array.isArray(left) || Array.isArray(right))
      return Array.isArray(left) && Array.isArray(right) && left.length === right.length
        ? left.every((v, i) => this.equals(v, right[i])) : false;

    if (Object.keys(left).length !== Object.keys(right).length)
      return false;

    for (const prop in left)
      if (!this.equals(left[prop], right[prop]))
        return false;

    return true;
  },



  // merge objects
  // ---------------------------------------------------------------------------------------------------
  merge(src: any, target: any) {
    if (!src || !target)
      return target;

    for (const prop in target)
      src[prop] = target[prop];

    return src;
  },

  deepMerge(src: any, target: any) {
    if (!src || !target || typeof src !== 'object' || typeof target !== "object")
      return target;

    if (target instanceof Date)
      return new Date(target);

    if (Array.isArray(target))
      for (const i of target.keys())
        src[i] = this.deepMerge(src[i], target[i]);
    else
      for (const prop in target)
        src[prop] = this.deepMerge(src[prop], target[prop]);
  },




  // get value from path
  // ---------------------------------------------------------------------------------------------------
  getValueFromPath(path: string, src: any) {
    return path
      .trim()
      .replace(/\[(\d+)\]/g, (_, $1) => `.${$1}`)
      .split(".")
      .reduce((ctx, prop) => ctx?.[prop] ?? null, src || null);
  },



  // (set, merge or deepMerge) value on path
  // ---------------------------------------------------------------------------------------------------
  setValueOnPath(path: string, value: any, src: any, createPath = false) {
    if (!src || !path?.trim())
      return src;

    path
      .trim()
      .replace(/\[(\d+)\]/g, (_, $1) => `.${$1}`)
      .split(".")
      .reduce((ctx, prop, i, arr) => {
        if (i < arr.length - 1)
          return ctx?.[prop] ?? (createPath ? ctx[prop] = {} : null);

        if (!ctx)
          return null;

        ctx[prop] = value;
      }, src);

    return src;
  },

  mergeValueOnPath(path: string, value: any, src: any, createPath = false) {
    if (!src || !path?.trim())
      return src;

    path
      .trim()
      .replace(/\[(\d+)\]/g, (_, $1) => `.${$1}`)
      .split(".")
      .reduce((ctx, prop, i, arr) => {
        if (i < arr.length - 1)
          return ctx?.[prop] ?? (createPath ? ctx[prop] = {} : null);

        if (!ctx)
          return null;

        ctx[prop] = this.merge(ctx[prop], value);
      }, src);

    return src;
  },

  deepMergeValueOnPath(path: string, value: any, src: any, createPath = false) {
    if (!src || !path?.trim())
      return src;

    path
      .trim()
      .replace(/\[(\d+)\]/g, (_, $1) => `.${$1}`)
      .split(".")
      .reduce((ctx, prop, i, arr) => {
        if (i < arr.length - 1)
          return ctx?.[prop] ?? (createPath ? ctx[prop] = {} : null);

        if (!ctx)
          return null;

        ctx[prop] = this.deepMerge(ctx[prop], value);
      }, src);

    return src;
  },





  // clone object
  // ---------------------------------------------------------------------------------------------------
  cloneObject<T>(obj: T): T {
    const dest: any = {}

    if (!obj || typeof obj !== 'object')
      return obj;

    if (obj instanceof Date)
      return new Date(obj) as T;

    if (Array.isArray(obj))
      return obj.map(el => this.cloneObject(el)) as any;

    for (const prop in obj)
      dest[prop] = this.cloneObject(obj[prop]);

    return dest;
  },





  // freeze object
  // ---------------------------------------------------------------------------------------------------
  freezeObj<T>(obj: T): T {
    if (!obj || typeof obj !== 'object')
      return obj;

    if (Array.isArray(obj))
      for (const prop of obj)
        this.freezeObj(prop);
    else
      for (const prop in obj)
        this.freezeObj(obj[prop]);

    return Object.freeze(obj);
  },




  // pick
  // ---------------------------------------------------------------------------------------------------
  pick<T extends Record<string, any>, U extends (keyof T)>(src: T, props: U[]): Pick<T, U> {
    const output = {} as Pick<T, U>;

    for (const prop in props)
      (output as any)[prop] = (src as any)[prop];

    return output;
  },



  // omit
  // ---------------------------------------------------------------------------------------------------
  omit<T extends Record<string, any>, U extends (keyof T)>(src: T, props: U[]): Omit<T, U> {
    const output = {} as Omit<T, U>;

    for (const prop in src)
      if (!props.includes(prop as any))
        (output as any)[prop] = src[prop];

    return output;
  },


  // transpose fields
  // ---------------------------------------------------------------------------------------------------
  transpose<T extends Record<string, any>, U extends keyof T>(src: T[], kvs: [key: U, value: U][]) {
    return src.map(r => {
      const out: any = { ...r };

      for (const kv of kvs) {

        out[out[kv[0]]] = out[kv[1]]

        delete out[kv[0]];
        delete out[kv[1]];
      }

      return out as Record<string, any>;
    });
  },


  // Merge By Field
  // ---------------------------------------------------------------------------------------------------
  groupMergeBy<T extends Record<string, any>, U extends keyof T>(src: T[], prop: U) {
    const map = new Map<string, Record<string, any>>();

    for (const r of src) {
      const obj = map.get(r[prop] as string) || {};

      map.set(r[prop] as string, Object.assign(obj, r));
    }

    return [...map.values()];
  },


  // Objects To Arrays
  // ---------------------------------------------------------------------------------------------------
  objectsToArrays<T extends Record<string, any>, U extends keyof T>(src: T[]) {
    if (src.length === 0)
      return { headers: [], values: [] };

    const headers = Object.keys(src[0]) as U[];

    return { headers, values: src.map(r => headers.map(h => r[h])) }
  },


  // Objects To Columns
  // ---------------------------------------------------------------------------------------------------
  objectsToColumns(data: Record<string, number>[]) {
    const columnsValues: number[][] = [];
    const columns = Object.keys(data[0]);

    for (let i = 0; i < columns.length; i++)
      columnsValues.push([]);

    for (const record of data) {

      for (let j = 0; j < columns.length; j++) {
        const key = columns[j];
        columnsValues[j].push(record[key]);
      }
    }

    return columnsValues;
  }
}
