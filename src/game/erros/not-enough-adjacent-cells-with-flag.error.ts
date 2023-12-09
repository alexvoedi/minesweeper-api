export class NotEnoughAdjacentCellsWithFlagError extends Error {
  constructor() {
    super(`Not enough adjacent cells with flag`);
  }
}
