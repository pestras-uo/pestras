/* eslint-disable @typescript-eslint/no-explicit-any */
export const strUtil = {
  compile(template: string, ...data: { [key: string]: any }[]): string {
    const reg = /\{\{\s*([\w.]+)\s*\}\}/g;
    let skip = data.length > 1;

    for (let i = 0; i < data.length; i++) {
      const source = data[i];
      skip = i < data.length - 1;

      template = template.replace(reg, (_: string, $1: string): string => {
        const parts = $1.split(".");
        let temp: any;

        if (parts.length == 1) {
          const value = source[parts[0]];
          return value === undefined ? (skip ? `{{${$1}}}` : "") : value;
        }

        temp = source[parts[0]];

        for (let i = 1; i < parts.length; i++) {
          temp = temp[parts[i]];
        }

        return temp === undefined ? (skip ? `{{${$1}}}` : "") : temp;
      });
    }

    return template;
  }
}