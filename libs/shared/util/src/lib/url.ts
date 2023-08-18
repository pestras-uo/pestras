/* eslint-disable @typescript-eslint/no-explicit-any */
// Request interface
// -------------------------------------------------------------------------------------
export function injectURLPayload(
  url: string,
  params?: any,
  query?: any
) {
  let path = "";
  params = params || {};
  query = query || {};

  path = url.replace(/(:[a-z][a-zA-Z0-9_]*[?]?)/g, (m: string, g: string) => {
    let param = g.slice(1);
    const isOptional = param.endsWith('?');

    if (isOptional)
      param = param.slice(0, param.length - 1);

    if (params[param] === undefined && !isOptional)
      throw new Error(`param_${param}_IsRequired`);

    return params[param] ? params[param] : "";
  });

  if (Object.keys(query).length > 0)
    path += '?' + toQuery(query);

  return encodeURI(path);
}

function toQuery(obj: Record<string, string>) {
  let result = "";

  for (const key in obj)
    result += `&${key}=${obj[key]}`;

  return result ? result.slice(1) : result;
}