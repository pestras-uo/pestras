/**
 * ### Linear Interpolation
 * Maps list of numbers to specified range
 * @param src number[]
 * @param outRange [min: number, max: number]
 */
export function lerp(src: number[], outRange: [min: number, max: number]): number[];
/**
 * ### Linear Interpolation
 * Maps value to specified range
 * @param src number[]
 * @param inRange [min: number, max: number]
 * @param outRange [min: number, max: number]
 */
export function lerp(src: number, inRange: [min: number, max: number], outRange?: [min: number, max: number]): number;
/**
 * ### Linear Interpolation
 * Maps list of numbers to specified range
 * @param src number[]
 * @param inRange [min: number, max: number]
 * @param outRange [min: number, max: number]
 */
export function lerp(src: number[], inRange: [min: number, max: number], outRange?: [min: number, max: number]): number[];
export function lerp(src: number | number[], inRange: [min: number, max: number], outRange?: [min: number, max: number]) {
  let oRange: [min: number, max: number];
  let iRange: [min: number, max: number] | null;

  if (outRange) {
    oRange = outRange;
    iRange = inRange;
  } else {
    oRange = inRange;
    iRange = null;
  }

  const oDist = oRange[1] - oRange[0];
  let min: number;
  let max: number;
  let iDist = 0;

  if (iRange) {
    min = iRange[0];
    max = iRange[1];

  } else {
    min = Math.min(...src as number[]);
    max = Math.max(...src as number[]);
  }

  iDist = max - min;

  return typeof src === 'number'
    ? src * oDist / iDist + oRange[0]
    : src.map(num => num * oDist / iDist + oRange[0]);
}

/**
 * ### Linear Interpolation Factory
 * Creates lerp function with built in ranges.
 * @param inRange [min: number, max: number]
 * @param outRange [min: number, max: number]
 * @returns lerp(value: number | number[]) => numner | number[]
 */
export function createLerp(inRange: [min: number, max: number], outRange: [min: number, max: number]) {
  const inRangeDiff = inRange[1] - inRange[0];
  const outRangeDiff = outRange[1] - outRange[0];


  /**
   * ### Linear Interpolation
   * Maps value to built in range
   * @param value number
   * @returns number;
   */
  function lerp(value: number): number;
  /**
   * ### Linear Interpolation
   * Maps array of values to built in range
   * @param values number[]
   * @returns number[]
   */
  function lerp(values: number[]): number[];
  function lerp(values: number | number[]): number | number[] {
    if (typeof values === 'number')
      return values * outRangeDiff / inRangeDiff + outRange[0];

    return values.map(value => value * outRangeDiff / inRangeDiff + outRange[0]);
  }

  return lerp;
}