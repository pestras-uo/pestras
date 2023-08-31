export type DateUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export const dateUtil = {

  dateAdd(parts: { unit: DateUnit, amount: number }[], value: Date | number | string) {
    const date = value === '$$NOW' ? new Date() : new Date(value);

    for (const part of parts) {
      if (part.unit === 'year')
        date.setFullYear(date.getFullYear() + part.amount);
      else if (part.unit === 'month')
        date.setMonth(date.getMonth() + part.amount);
      else if (part.unit === 'day')
        date.setDate(date.getDay() + part.amount);
      else if (part.unit === 'hour')
        date.setHours(date.getHours() + part.amount);
      else if (part.unit === 'minute')
        date.setHours(date.getMinutes() + part.amount);
      else if (part.unit === 'second')
        date.setHours(date.getSeconds() + part.amount);
    }

    return date;
  },

  dateUnit(date: Date | string | number, modifier: DateUnit) {
    const d = date === '$$NOW' ? new Date() : new Date(date);

    if (d.toString() === 'Invalid Date')
      throw new Error("invalidDate");

    return modifier === 'year'
      ? d.getFullYear()
      : modifier === 'month'
        ? d.getMonth() + 1
        : modifier === 'day'
          ? d.getDate()
          : modifier === 'hour'
            ? d.getHours()
            : modifier === 'minute'
              ? d.getMinutes()
              : d.getSeconds();
  },

  duration(
    dateFrom: Date | string | number,
    dateTo: Date | string | number,
    unit: DateUnit
  ) {
    const fromDate = dateFrom === '$$NOW' ? new Date() : new Date(dateFrom);
    const toDate = dateTo === '$$NOW' ? new Date() : new Date(dateTo);

    if (fromDate.toString() === 'Invalid Date' || toDate.toString() === 'Invalid Date')
      throw new Error("invalidDate");

    if (unit === 'year')
      return toDate.getFullYear() - fromDate.getFullYear();

    if (unit === 'month') {
      const years = toDate.getFullYear() - fromDate.getFullYear();
      const months = toDate.getMonth() - fromDate.getMonth();

      return (years * 12) + months;
    }

    const delta = toDate.getTime() - fromDate.getTime();

    return unit === 'day'
      ? Math.floor(delta / 86_400_000)
      : unit === 'hour'
        ? Math.floor(delta / 3_600_000)
        : unit === 'minute'
          ? Math.floor(delta / 60_000)
          : Math.floor(delta / 1000)
  },

  formatDate,

  parseDate(date: string, format: string) {
    format = format
        .replace(/%Y/g, "YYYY")
        .replace(/%m/g, "mm")
        .replace(/%d/g, "dd")
        .replace(/%H/g, "HH")
        .replace(/%M/g, "MM")
        .replace(/%S/g, "SS")
        .replace(/%L/g, "LLL");
  
    const yearsIndex = format.indexOf('YYYY');
    const monthsIndex = format.indexOf('mm');
    const daysIndex = format.indexOf('dd');
    const hoursIndex = format.indexOf('HH');
    const minutesIndex = format.indexOf('MM');
    const secondsIndex = format.indexOf('SS');
    const milliIndex = format.indexOf('LLL');
  
    const parts: number[] = [];
  
    parts.push(yearsIndex > -1 ? +date.slice(yearsIndex, yearsIndex + 4) || 1970 : 1970);
    parts.push(monthsIndex > -1 ? (+date.slice(monthsIndex, monthsIndex + 2) - 1) : 0);
    parts.push(daysIndex > -1 ? +date.slice(daysIndex, daysIndex + 2) || 0 : 0);
    parts.push(hoursIndex > -1 ? +date.slice(hoursIndex, hoursIndex + 2) || 0 : 0);
    parts.push(minutesIndex > -1 ? +date.slice(minutesIndex, minutesIndex + 2) || 0 : 0);
    parts.push(secondsIndex > -1 ? +date.slice(secondsIndex, secondsIndex + 2) || 0 : 0);
    parts.push(milliIndex > -1 ? +date.slice(milliIndex, milliIndex + 3) || 0 : 0);
  
    const output = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);
  
    return output.toString() === 'Invalid Date' ? null : output;;
  }
}


function formatDate(format: string, inc?: Partial<Record<DateUnit, number>>): string;
function formatDate(date: Date, format: string, inc?: Partial<Record<DateUnit, number>>): string;
function formatDate(date: string | Date, format?: string | Partial<Record<DateUnit, number>>, inc: Partial<Record<DateUnit, number>> = {}): string {
  const d = date instanceof Date ? date : new Date();
  const f = typeof date === 'string' ? date : format as string;
  const i = typeof format === "string" ? inc : format || {};


  d.setFullYear(d.getFullYear() + (i.year || 0));
  d.setMonth(d.getMonth() + (i.month || 0));
  d.setDate(d.getDate() + (i.day || 0));
  d.setHours(d.getHours() + (i.hour || 0));
  d.setMinutes(d.getMinutes() + (i.minute || 0));
  d.setSeconds(d.getSeconds() + (i.second || 0));

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milli = d.getMilliseconds();
  const parts: Record<string, string> = {
    "%y": "" + year,
    "%m": month < 10 ? `0${month}` : "" + month,
    "%d": day < 10 ? `0${day}` : "" + day,
    "%H": hours < 10 ? `0${hours}` : "" + hours,
    "%M": minutes < 10 ? `0${minutes}` : "" + minutes,
    "%S": seconds < 10 ? `0${seconds}` : "" + seconds,
    "%L": milli < 10 ? `00${milli}` : milli < 100 ? "0" + seconds : "" + milli
  }

  return f.replace(/(%[YmdHMSL]{1})/g, (_, $) => parts[$] || "!!");
}