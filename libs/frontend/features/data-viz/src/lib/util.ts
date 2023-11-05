/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataRecord, Field, MapScatterTooltopOptions, Region, Stats, TypesNames } from "@pestras/shared/data-model";
import { GeoLocation } from "@pestras/shared/util";

export interface ChartDataLoad {
  fields: Field[];
  records: DataRecord[];
}

export function getCategories(values: any[], type: TypesNames) {

  if (type === 'date' || type === 'datetime')
    return values.map(v => new Date(v).toDateString());

  return values;
}

export function getCategory(value: any, type: TypesNames) {

  if (type === 'date' || type === 'datetime')
    return new Date(value).toDateString();

  return value;
}

export function jsonToArrayOfArrays(data: Record<string, any>[]): any[][] {
  if (data.length === 0)
    return [];

  const headers = Object.keys(data[0]);

  return [headers].concat(data.map(r => headers.map(h => r[h])))
}

export function generateMapGeoJson(regions: Region[]) {
  return {
    type: "FeatureCollection",
    features: regions
      .filter(r => r.coords)
      .map(r => {
        return r.coords
          ? {
            type: 'feature',
            properties: {
              name: r.name
            },
            geometry: {
              type: r.coords?.type,
              coordinates: [(r.coords.coordinates[0]).map(c => [c.lng, c.lat])]
            }
          }
          : null
      })
      .filter(Boolean)
  };
}

export function groupRecords<T extends Record<string, any>>(data: T[], by: string, modifyFields: string[], method: Stats.DescriptiveStatsProps): T[] {
  const map = new Map<string, T[]>();
  const output: T[] = [];

  for (const r of data) {
    if (!map.has(r[by]))
      map.set(r[by], []);

    map.get(r[by])?.push(r);
  }

  for (const list of map.values()) {
    const first: any = list[0];

    for (const field of modifyFields)
      first[field] = Stats[method](list.map(r => r[field]));

    output.push(first);
  }

  return output;
}

export function groupRecords2D<T extends Record<string, any>>(data: T[], by: [string, string], modifyFields: string[], method: Stats.DescriptiveStatsProps): T[] {
  const map = new Map<string, T[]>();
  const output: T[] = [];

  for (const r of data) {
    if (!map.has(r[by[0]]))
      map.set(r[by[0]], []);

    map.get(r[by[0]])?.push(r);
  }

  for (const list of map.values())
    output.push(...groupRecords(list, by[1], modifyFields, method));

  return output;
}

export function recordToolTip(content: Record<string, any>, fields: Field[], options: MapScatterTooltopOptions, record: DataRecord, docsPath: string) {
  const banner = options.image ? fields.find(f => f.name === options.image) : null;
  const title = options.heading ? fields.find(f => f.name === options.heading) : null;
  const customFields = fields.filter(f => !f.system);
  const location = fields.find(f => f.type === 'location');
  const region = customFields.find(f => f.type === 'region');

  let view = '<div class="rtl w-8">';

  // title
  if (title && record[title.name])
    view += `<h4 class="card-header">${record[title.name]}</h4>`;

  // banner
  if (banner && record[banner.name])
    view += `
      <div class="card-hero">
        <img src="${docsPath}${record[banner.name]}" alt="${banner.name}">
      </div>
    `;

  view += '<div class="card-body">';

  // groups
  for (const fieldName of options.body) {
    const field = fields.find(f => f.name === fieldName);

    if (!field)
      continue;

    const value = ['date', 'datetime'].includes(field.type)
      ? record[field.name] ? (new Date(record[field.name] as string).toLocaleDateString()) : null
      : (record[field.name] ?? null);

    if (value)
      view += `
        <div class="flex gap-4 align-items-center justify-content-space-between mbe-2">
          <p>${field.display_name}</p>
          <p class="bold">${value}</p>
        </div>
      `;
  }

  view += "</div>";

  //  & location
  if (region && location) {
    const loc = record[location.name] as GeoLocation;

    if (loc)
      view += `
        <div class="card-footer">
          <p>${record[region.name]}</p>
          <div class="grow"></div>
          <a class="btn btn-round btn-small btn-primary" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}">${content['location']}</a>
        </div>
      `;
  }

  view += "</div>";

  return view;
}