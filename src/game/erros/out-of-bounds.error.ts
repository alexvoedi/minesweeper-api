import { xyToString } from '../helpers/xy-to-string';

export class OutOfBoundsError extends Error {
  constructor({
    x,
    y,
    xMin,
    xMax,
    yMin,
    yMax,
  }: {
    x: number;
    y: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }) {
    super(
      `${xyToString([
        x,
        y,
      ])} is out of bounds. Allowed values: ${xMin} <= x <= ${xMax} and ${yMin} <= y <= ${yMax}`,
    );
  }
}
