export const colors = [
  '#3d3df5',
  '#1dc973',
  '#ff8000',
  '#ff0040',
  '#B14AED',
  '#334139',
  '#e07a5f',
  '#81B29A'
];

export function getRandomColors(count = 1, offset = 10) {
  const colors: string[] = [];

  for (let i = 0; i < count; i++)
    colors.push(getRandomColor(offset));

  return colors;
}

export function getRandomColor(offset = 10) {
  return lightenColor(
    colors[Math.round(Math.random() * (colors.length - 1))],
    Math.round(Math.random() * offset) * (Math.round(Math.random()) ? 1 : -1)
  );
}

export function lightenColor(color: string, amount: number) {
  let r: number | string = parseInt(color.slice(1, 3), 16);
  let g: number | string = parseInt(color.slice(3, 5), 16);
  let b: number | string = parseInt(color.slice(5), 16);

  r = r + Math.round((255 * amount / 100));
  g = g + Math.round((255 * amount / 100));
  b = b + Math.round((255 * amount / 100));

  r > 255 && (r = 255);
  g > 255 && (g = 255);
  b > 255 && (b = 255);

  r < 0 && (r = 0);
  g < 0 && (g = 0);
  b < 0 && (b = 0);

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  r.length === 1 && (r = '0' + r);
  g.length === 1 && (g = '0' + g);
  b.length === 1 && (b = '0' + b);

  return `#${r}${g}${b}`;
}

export function darkenColor(color: string, amount: number) {
  let r: number | string = parseInt(color.slice(1, 3), 16);
  let g: number | string = parseInt(color.slice(3, 5), 16);
  let b: number | string = parseInt(color.slice(5), 16);

  r = r - Math.round((255 * amount / 100));
  g = g - Math.round((255 * amount / 100));
  b = b - Math.round((255 * amount / 100));

  r > 255 && (r = 255);
  g > 255 && (g = 255);
  b > 255 && (b = 255);

  r < 0 && (r = 0);
  g < 0 && (g = 0);
  b < 0 && (b = 0);

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  r.length === 1 && (r = '0' + r);
  g.length === 1 && (g = '0' + g);
  b.length === 1 && (b = '0' + b);

  return `#${r}${g}${b}`;
}