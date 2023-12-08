import { Xy } from '../types/xy';

export function xyToString([x, y]: Xy) {
  return `(${x}/${y})`;
}
