import { xyToString } from '../helpers/xy-to-string';

export class InvalidCoordinateError extends Error {
  constructor({ x, y }: { x: number; y: number }) {
    super(
      `The coordinate ${xyToString([
        x,
        y,
      ])} is invalid. Only positive integer values are allowed.`,
    );
  }
}
