export function getLocationFromLink(link: string) {
  if (!link)
    return null;

  if (link.includes('/maps/place')) {
    const part1 = link.split('@')[1];
    const [lat, lng] = part1.split(',');

    return { lat: +lat, lng: +lng };

  } else if (link.includes('?q=') || link.includes('query=')) {
    const q = link.split('?')[1];
    const pairs = q.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');

      if (key === "q" || key === "query") {
        const [lat, lng] = value.split(",");

        return lat && lng ? { lat: +lat, lng: +lng } : null;
      }
    }

    return null;

  } else
    return null;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export function parseLocation(input: string | string[] | GeoLocation): GeoLocation | null {
  if (typeof input === 'string' && ((input.startsWith('{') && input.endsWith("}")) || (input.startsWith('[') && input.endsWith(']'))))
    return parseLocation(JSON.parse(input));

  if (typeof input === 'string') {
    const parts = input.replace(/\s+/g, '').split(',');

    if (parts.length !== 2 || isNaN(+parts[0]) || isNaN(+parts[1]))
      return null;

    return { lat: +parts[0], lng: +parts[1] } as GeoLocation;

  } else if (Array.isArray(input)) {
    if (input.length !== 2 || isNaN(+input[0]) || isNaN(+input[1]))
      return null;

    return { lat: +input[0], lng: +input[1] } as GeoLocation;

  } else if (input && typeof input === 'object' && input['lat'] && input['lng'])
    return input;

  return null;
}