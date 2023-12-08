import { xyToString } from '../helpers/xy-to-string';
import { Xy } from '../types/xy';

export class CellNotFoundError extends Error {
  constructor([x, y]: Xy) {
    super(
      `Cell at coordinate ${xyToString([
        x,
        y,
      ])} not found. Check the coordinate.`,
    );
  }
}
