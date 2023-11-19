export enum Interval {
  ON_DEMAND = -1,
  NONE = 0,
  MONTHLY = 1,
  QUARTERLY = 3,
  BIANNUAL = 6,
  ANNUAL = 12
}

export const intervalsByMonth = [
  [1,3,6,12],  // jan
  [1],         // feb
  [1],         // march
  [1,3],       // april
  [1],         // may
  [1],         // june
  [1,3,6],     // july
  [1],         // august
  [1],         // sep
  [1,3],       // oct
  [1],         // nov
  [1]          // dec
];