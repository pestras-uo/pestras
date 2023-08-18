export type TimeDuration = `${number}${'h' | 'm' | 's'}`[];

export function parseDuration(str: TimeDuration) {
  const units = {
    h: 3600,
    m: 60,
    s: 1
  };

  return str
    .map(part => {
      const [amount, unit] = [part.slice(0, -1), part.slice(-1)];

      if (!['m', 'h', 's'].includes(unit))
        return 0;

      return units[unit as 'h'] * +amount;
    })
    .reduce((total, curr) => total + curr, 0) * 1000;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export function parseTime(time: any): Time | null {
  if (!time)
    return null;

  if (typeof time === 'string') {
    const [hours, minutes, seconds] = time.split(':');
  
    if (!isNaN(+hours) || !!isNaN(+minutes))
      return null;
  
    return { hours: +hours, minutes: +minutes, seconds: +seconds || 0 };

  } else if (Array.isArray(time)) {
    const [hours, minutes, seconds] = time;

    if (!isNaN(+hours) || !!isNaN(+minutes))
      return null;
  
    return { hours: +hours, minutes: +minutes, seconds: +seconds || 0 };

  } else if (typeof time === 'object') {
    const { hours, minutes, seconds } = time;

    if (!isNaN(+hours) || !!isNaN(+minutes))
      return null;
  
    return { hours: +hours, minutes: +minutes, seconds: +seconds || 0 };
  }

  return null;
}